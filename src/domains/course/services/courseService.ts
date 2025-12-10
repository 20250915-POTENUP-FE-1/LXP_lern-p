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
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/shared/lib/firebase/firestore';

import type { User } from '@/domains/user/types/user';
import type {
  Course,
  Section,
  Lecture,
  CourseDetailResponse,
  CreateCourseRequest,
  CreateSectionRequest,
  SectionDraft,
  CourseDraft,
} from '../types/course';

export const getAllPublishedCourses = async (): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, 'courses'),
      where('status', '==', 'published'), ///여기에요
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Course, 'id'>;
      return { id: docSnap.id, ...data };
    });
  } catch (err) {
    console.error('[getAllPublishedCourses] Firestore error:', err);
    throw err;
    //console.error('getAllCourses 실패:', err);
    //throw new Error('강좌를 불러오지 못했습니다.');
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
  courseData: CreateCourseRequest,
  sectionList: CreateSectionRequest[],
  status: 'draft' | 'published' | 'hidden' = 'published',
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
      status,
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

{
  /*임시저장된 강좌 관련 서비스 함수들*/
}

// CourseDraft  와 SectionFormDraft  불러와서 폼Draftf 타입 정의
export const fetchCourseWithSections = async (
  courseId: string,
): Promise<{
  courseDraft: CourseDraft; // 👈 용어 변경: basicInfo -> courseDraft
  sectionDrafts: SectionDraft[]; // 👈 용어 변경: sections -> sectionDrafts
}> => {
  if (!courseId) throw new Error('Invalid course ID');

  // 기존의 getCourse 함수를 재활용하여 데이터 로드
  const { course, sections, lectures } = await getCourse(courseId);

  if (!course) {
    throw new Error('강좌 정보를 찾을 수 없습니다.');
  }

  // 1. Step 1 폼 데이터 (courseDraft) 생성
  const courseDraft: CourseDraft = {
    title: course.title,
    summary: course.summary,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    category: course.category,
    level: course.level,
    price: course.price,
  };

  // 2. Step 2 폼 데이터 (SectionDraft[]) 생성
  const sectionDrafts: SectionDraft[] = sections.map((sec) => ({
    id: sec.id, // SectionDraft는 id를 포함합니다.
    title: sec.title,
    lectures: (lectures[sec.id] || []).map((lec) => ({
      id: lec.id, // LectureDraft도 id를 포함합니다.
      title: lec.title,
      duration: lec.duration,
      videoUrl: lec.videoUrl,
    })),
  }));

  return { courseDraft, sectionDrafts };
};

// 임시저장된 강좌 불러오기
export const fetchCourseData = async (courseId: string): Promise<CourseDraft> => {
  if (!courseId) throw new Error('Invalid course ID');

  try {
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      throw new Error('강좌를 찾을 수 없습니다.');
    }

    const data = courseSnap.data() as Course;

    // CourseDraft 타입으로 변환 (price는 number로 간주)
    return {
      title: data.title,
      summary: data.summary,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      category: data.category,
      level: data.level,
      price: data.price, // Course에서 price는 number 타입이므로 그대로 사용
    } as CourseDraft;
  } catch (err) {
    console.error('fetchCourseData 실패:', err);
    throw new Error('강좌 기본 정보를 불러오지 못했습니다.');
  }
};

// 새로운 임시 강좌 객체 생성
export const createDraftCourse = async (user: User, draftData: CourseDraft): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    const courseRef = await addDoc(collection(db, 'courses'), {
      ...draftData,
      instructorId: user.id,
      instructorName: user.name,
      tags: [draftData.level || '', draftData.category?.[2] || ''],
      price: Number(draftData.price),
      isFree: Number(draftData.price) === 0,
      studentCount: 0,
      duration: 0,
      status: 'draft', // 임시 강좌 상태
      sections: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const draftId = courseRef.id;
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      createdCourses: arrayUnion(draftId),
      updatedAt: serverTimestamp(),
    });

    return draftId;
  } catch (err) {
    console.error('createDraftCourse 실패:', err);
    throw new Error('임시 강좌 생성 중 오류가 발생했습니다.');
  }
};

//강좌 기본 정보만 업데이트 (Step 1 저장)
export const updateDraftCourse = async (draftId: string, data: CourseDraft): Promise<void> => {
  if (!draftId) throw new Error('Invalid draft ID');

  try {
    const courseRef = doc(db, 'courses', draftId);
    await updateDoc(courseRef, {
      title: data.title,
      summary: data.summary,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      category: data.category,
      level: data.level,
      price: Number(data.price),
      isFree: Number(data.price) === 0,
      tags: [data.level || '', data.category?.[2] || ''],
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('updateDraftCourse 실패:', err);
    throw new Error('임시 강좌 기본 정보 수정 중 오류가 발생했습니다.');
  }
};

//섹션/강의 업데이트 (Step 2에서 개별 수정)
export const updateDraftSection = async (
  draftId: string,
  sectionList: CreateSectionRequest[],
): Promise<void> => {
  try {
    // [1] 기존 섹션 및 강의 삭제 (Write Batch 사용)
    const batch = writeBatch(db);
    const sectionsToDelete = await getDocs(
      query(collection(db, 'sections'), where('courseId', '==', draftId)),
    );
    const lecturesToDelete = await getDocs(
      query(collection(db, 'lectures'), where('courseId', '==', draftId)),
    );

    sectionsToDelete.docs.forEach((d) => batch.delete(d.ref));
    lecturesToDelete.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();

    // [2] 새로운 섹션/강의 생성 (createCourse의 반복문 로직 재활용)
    const totalDuration =
      sectionList.reduce(
        (total, sec) => total + sec.lectures.reduce((sum, lec) => sum + (lec.duration || 0), 0),
        0,
      ) || 0;

    const courseRef = doc(db, 'courses', draftId);
    const sectionIds: string[] = [];

    for (let i = 0; i < sectionList.length; i++) {
      const sectionData = sectionList[i];
      // addDoc 대신 doc(collection)과 setDoc을 사용해 Ref를 먼저 만듭니다.
      const sectionRef = doc(collection(db, 'sections'));

      await setDoc(sectionRef, {
        // setDoc 사용
        courseId: draftId,
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
        const lectureRef = doc(collection(db, 'lectures')); // Ref 생성
        await setDoc(lectureRef, {
          courseId: draftId,
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

    // [3] Draft Course 문서의 메타데이터 업데이트
    await updateDoc(courseRef, {
      sections: sectionIds,
      duration: totalDuration,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('updateDraftSection 실패:', err);
    throw new Error('임시 강좌 섹션 수정 중 오류가 발생했습니다.');
  }
};

//임시 강좌를 최종 강좌로 발행
export const publishDraftCourse = async (draftId: string): Promise<void> => {
  try {
    const courseRef = doc(db, 'courses', draftId);
    await updateDoc(courseRef, {
      status: 'published', // 발행 상태로 변경
      createdAt: serverTimestamp(), // 발행 시점으로 생성 시간 업데이트
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('publishDraftCourse 실패:', err);
    throw new Error('강좌 발행 중 오류가 발생했습니다.');
  }
};
