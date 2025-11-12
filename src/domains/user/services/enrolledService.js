import { db } from '@/shared/lib/firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getEnrolledCourses(userId) {
  // 1) 해당 유저의 수강 내역 가져오기
  const enrolledSnap = await getDocs(
    query(collection(db, 'enrollments'), where('userId', '==', userId)),
  );

  const enrolled = enrolledSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 수강 기록 없으면 바로 빈 배열 반환
  if (enrolled.length === 0) return [];

  // 2) courseId 목록 추출
  const courses = enrolled.map((item) => item.courseId);

  // 3) 해당 강의 목록 가져오기
  const courseSnap = await getDocs(
    query(collection(db, 'courses'), where('__name__', 'in', courses)),
  );

  const courseMap = {};
  courseSnap.forEach((doc) => {
    courseMap[doc.id] = doc.data();
  });

  // 4) join
  return enrolled.map((item) => ({
    ...item,
    course: courseMap[item.courseId] ?? null,
  }));
}
