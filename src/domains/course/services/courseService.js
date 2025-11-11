import { db } from '@/shared/lib/firebase/firestore';
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
  where,
} from 'firebase/firestore';

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
        enrolledCourseIds: arrayUnion(enrollmentRef.id),
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
