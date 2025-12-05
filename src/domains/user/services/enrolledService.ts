import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { EnrolledCourse } from "@/domains/user/types/enrolled";

export async function getEnrolledCourses(userId: string): Promise<EnrolledCourse[]> {
  const enrolledSnap = await getDocs(
    query(collection(db, "enrollments"), where("userId", "==", userId))
  );

  // 🔥 enrolled 타입 명확히 지정
  const enrolled = enrolledSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as {
      userId: string;
      courseId: string;
      progress?: number;
      createdAt?: string | null;
      updatedAt?: string | null;
    }),
  }));

  if (enrolled.length === 0) return [];

  const courseIds = enrolled.map((item) => item.courseId);

  const courseSnap = await getDocs(
    query(collection(db, "courses"), where("__name__", "in", courseIds))
  );

  const courseMap: Record<string, DocumentData> = {};
  courseSnap.forEach((doc) => {
    courseMap[doc.id] = doc.data();
  });

  return enrolled.map((item) => ({
    id: item.id,
    userId: item.userId,
    courseId: item.courseId,
    progress: item.progress ?? 0,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    course: courseMap[item.courseId]
      ? {
          id: item.courseId,
          title: courseMap[item.courseId].title ?? "제목 없음",
          category: courseMap[item.courseId].category ?? "카테고리 없음",
          thumbnailUrl: courseMap[item.courseId].thumbnailUrl ?? null,
        }
      : null,
  })) as EnrolledCourse[];
}