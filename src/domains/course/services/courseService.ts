import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';

import type {
  Course,
  Section,
  Lecture,
  CourseDetailResponse,
  CreateCourseInput,
  CreateSectionInput,
} from '../types/course';
import type { User } from '@/domains/user/types/user';

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Course, 'id'>;
      return { id: docSnap.id, ...data };
    });
  } catch (err) {
    console.error('getAllCourses 실패:', err);
    throw new Error('강좌를 불러오지 못했습니다.');
  }
};

export const getCourse = async (courseId: string): Promise<CourseDetailResponse> => {
  if (!courseId) {
    return { course: null, sections: [], lectures: {} };
  }

  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      return { course: null, sections: [], lectures: {} };
    }

    const courseData = courseSnap.data() as Omit<Course, 'id'>;
    const course: Course = { id: courseSnap.id, ...courseData };

    const sectionQuery = query(collection(db, 'sections'), where('courseId', '==', courseId));
    const sectionSnap = await getDocs(sectionQuery);

    const sections: Section[] = sectionSnap.docs
      .map((d) => {
        const data = d.data() as Omit<Section, 'id'>;
        return { id: d.id, ...data };
      })
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    const lectureQuery = query(collection(db, 'lectures'), where('courseId', '==', courseId));
    const lectureSnap = await getDocs(lectureQuery);

    const lectureList: Lecture[] = lectureSnap.docs.map((d) => {
      const data = d.data() as Omit<Lecture, 'id'>;
      return { id: d.id, ...data };
    });

    const lectureMap: Record<string, Lecture[]> = {};
    for (const section of sections) {
      lectureMap[section.id] = lectureList
        .filter((lec) => lec.sectionId === section.id)
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    }

    return { course, sections, lectures: lectureMap };
  } catch (err) {
    console.error('getCourse 실패:', err);
    throw new Error('강좌 정보를 불러오지 못했습니다.');
  }
};

export const applyCourse = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) throw new Error('Invalid params');

  try {
    const now = new Date().toISOString();

    await runTransaction(db, async (tx) => {
      const enrollmentRef = await addDoc(collection(db, 'enrollments'), {
        userId,
        courseId,
        progress: 0,
        enrolledAt: now,
        updatedAt: now,
      });

      const userRef = doc(db, 'users', userId);
      tx.update(userRef, {
        enrolledCourses: arrayUnion(enrollmentRef.id),
        updatedAt: serverTimestamp(),
      });

      const courseRef = doc(db, 'courses', courseId);
      tx.update(courseRef, {
        studentCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    });

    return true;
  } catch (err) {
    console.error('applyCourse 실패:', err);
    throw new Error('수강 신청 중 오류가 발생했습니다.');
  }
};

export const getEnrollmentStatus = async (userId: string, courseId: string): Promise<boolean> => {
  if (!userId || !courseId) return false;

  try {
    const q = query(
      collection(db, 'enrollments'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (err) {
    console.error('getEnrollmentStatus 실패:', err);
    return false;
  }
};

export const createCourse = async (
  user: User,
  courseData: CreateCourseInput,
  sectionList: CreateSectionInput[],
): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    const courseRef = await addDoc(collection(db, 'courses'), {
      title: courseData.title,
      summary: courseData.summary,
      description: courseData.description,
      thumbnailUrl: courseData.thumbnailUrl,
      instructorId: user.id,
      instructorName: user.name,
      category: courseData.category,
      level: courseData.level,
      tags: [courseData.level || '', courseData.category?.[2] || ''],
      price: Number(courseData.price),
      isFree: Number(courseData.price) === 0,
      studentCount: 0,
      duration:
        sectionList.reduce(
          (total, sec) => total + sec.lectures.reduce((sum, lec) => sum + (lec.duration || 0), 0),
          0,
        ) || 0,
      status: 'published',
      sections: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const courseId = courseRef.id;
    const sectionIds: string[] = [];

    for (let i = 0; i < sectionList.length; i++) {
      const sectionData = sectionList[i];
      const sectionRef = await addDoc(collection(db, 'sections'), {
        courseId,
        title: sectionData.title,
        sequence: i + 1,
        lectures: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const sectionId = sectionRef.id;
      sectionIds.push(sectionId);
      const lectureIds: string[] = [];

      for (let j = 0; j < sectionData.lectures.length; j++) {
        const lecData = sectionData.lectures[j];
        const lectureRef = await addDoc(collection(db, 'lectures'), {
          courseId,
          sectionId,
          title: lecData.title,
          videoUrl: lecData.videoUrl || '',
          duration: lecData.duration,
          sequence: j + 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        lectureIds.push(lectureRef.id);
      }

      await updateDoc(sectionRef, { lectures: lectureIds });
    }

    await updateDoc(courseRef, { sections: sectionIds });

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      createdCourses: arrayUnion(courseId),
      updatedAt: serverTimestamp(),
    });

    return courseId;
  } catch (err) {
    console.error('createCourse 실패:', err);
    throw new Error('강좌 등록 중 오류가 발생했습니다.');
  }
};
