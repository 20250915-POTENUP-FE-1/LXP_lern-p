import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db } from "@/shared/lib/firebase/firestore";
import type { InstructorCourse } from "@/domains/user/types/instructor";

/**
 * 강사가 개설한 강좌 목록 조회
 * @param userId - 강사 유저의 ID
 * @returns InstructorCourse[] Promise
 */
export async function getInstructorCourses(userId: string): Promise<InstructorCourse[]> {
  const q = query(collection(db, "courses"), where("instructorId", "==", userId));

  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const data = doc.data() as DocumentData;

    return {
      id: doc.id,
      title: data.title ?? "제목 없음",
      category: data.category ?? null,
      thumbnailUrl: data.thumbnailUrl ?? null,
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    } as InstructorCourse;
  });
}
