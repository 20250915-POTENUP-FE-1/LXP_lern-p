import { db } from "@/shared/lib/firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * 강사가 개설한 강좌 목록 조회
 * @param {string} userId - 강사 유저의 ID
 * @returns {Promise<Array>}
 */

export async function getInstructorCourses(userId) {
  const q = query(
    collection(db, "courses"),
    where("instructorId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,    // 강좌 ID (라우팅/수정 등에 필요)
    ...doc.data(), // 강좌 상세 데이터(title, category, etc)
  }));
}