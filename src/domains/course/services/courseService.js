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

/** 모든 강좌 목록 조회 */
export const getAllCourses = async () => {
  try {
    const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('getAllCourses 실패:', err);
    throw new Error('강좌 목록을 불러오지 못했습니다.');
  }
};

/** 특정 강좌 상세 정보 조회 */
export const getCourse = async (courseId) => {
  if (!courseId) return { course: null, sections: [], lectures: {} };

  try {
    // 강좌 기본 정보
    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);
    if (!courseSnap.exists()) return { course: null, sections: [], lectures: {} };
    const courseData = courseSnap.data();

    // 섹션 목록
    const sectionQuery = query(collection(db, 'sections'), where('courseId', '==', courseId));
    const sectionSnap = await getDocs(sectionQuery);
    const sections = sectionSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    // 강의 목록
    const lectureQuery = query(collection(db, 'lectures'), where('courseId', '==', courseId));
    const lectureSnap = await getDocs(lectureQuery);
    const lectures = lectureSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // 섹션별 매핑
    const lectureMap = {};
    for (const section of sections) {
      lectureMap[section.id] = lectures
        .filter((lec) => lec.sectionId === section.id)
        .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
    }

    return { course: courseData, sections, lectures: lectureMap };
  } catch (err) {
    console.error('getCourse 실패:', err);
    throw new Error('강좌 정보를 불러오지 못했습니다.');
  }
};

/** 수강 신청 처리 (트랜잭션 기반) */
export const applyCourse = async (userId, courseId) => {
  if (!userId || !courseId) throw new Error('Invalid params');

  try {
    const now = new Date().toISOString();

    await runTransaction(db, async (tx) => {
      // 1. enrollments 문서 생성
      const enrollmentRef = await addDoc(collection(db, 'enrollments'), {
        userId,
        courseId,
        progress: 0,
        enrolledAt: now,
        updatedAt: now,
      });

      // 2. users 업데이트
      const userRef = doc(db, 'users', userId);
      tx.update(userRef, {
        enrolledCourses: arrayUnion(enrollmentRef.id),
        updatedAt: serverTimestamp(),
      });

      // 3. courses 업데이트
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

/** 특정 유저의 수강 여부 조회 */
export const getEnrollmentStatus = async (userId, courseId) => {
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

/** 강좌 등록 (courses + sections + lectures + user 업데이트) */
export const createCourse = async (user, courseData, sectionList) => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    // 1. courses 컬렉션에 문서 추가 (자동 ID 생성)
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
    const sectionIds = [];

    // 2. sections 컬렉션 추가
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
      const lectureIds = [];

      // 3. lectures 컬렉션 추가
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

      // 4. 섹션 문서에 lectures 필드 업데이트
      await updateDoc(sectionRef, { lectures: lectureIds });
    }

    // 5. 강좌 문서에 sections 필드 업데이트
    await updateDoc(courseRef, { sections: sectionIds });

    // 6. 사용자 문서에 createdCourses 추가
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
