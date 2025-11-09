import styles from "@/domains/user/pages/MyPageSections.module.css";
import { auth, db } from "@/shared/lib/firebase/config";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Enrolled() {

  const [user, setUser] = useState(null);
  const [enrolledList, setEnrolledList] = useState([]);

  // TODO: 로그인 페이지 완성 후 제거할 것
  //signOut(auth);
  useEffect(() => {
    signInWithEmailAndPassword(auth, "dev@example.com", "12341234")
      .then(() => console.log("✅ 로그인 성공"))
      .catch(console.error);
  }, []);

  // 1) 로그인 상태 감지 (로그인하면 user 업데이트)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [])

   // 2) user.uid 가 생기면 → 해당 유저 수강 목록(enrolled) 가져오기
  useEffect(() => {
    if (!user) return;
    const fetchEnrolled = async (uid) => {
      // 1) enrolled 가져오기
      const enrolledRef = collection(db, "enrolled"); // 1. 컬렉션 선택 collection(db, "컬렉션명")
      const condition = where("userId", "==", uid); // 2. 조건 달기 where("필드", "연산자", 값)
      const q = query(enrolledRef, condition); // 3. 서버에서 데이터 가져오기 query(컬렉션, 조건들)
      const snapshot = await getDocs(q); // getDocs(쿼리)

      const enrolled  = snapshot.docs.map(doc => ({
        id: doc.id,      // 문서 고유 ID 포함시키기
        ...doc.data(),   // 문서에 저장된 실제 필드들 펼치기
      }));

      // 🔥 수강 내역이 없으면 바로 종료
      if (enrolled.length === 0) {
        setEnrolledList([]);
        return;
      }

      //console.log(enrolled)

      // 2) courseId만 모으기
      const courseIds = enrolled.map(item => item.courseId);
      
      // 3) course 정보 가져오기
      const courseRef = collection(db, "courses");
      const q2 = query(courseRef, where("__name__", "in", courseIds)); // __name__ 문서 id를 의미하는 Firestore의 예약 키워드.
      const courseSnap = await getDocs(q2);

      //console.log(courseSnap)

      const courseMap = {};
      courseSnap.forEach(doc => {
        courseMap[doc.id] = doc.data();
      });

      // 4) Join
      const finalList = enrolled.map(item => ({
        ...item,
        course: courseMap[item.courseId] || null
      }));

      //setEnrolledList(enrolled);
      setEnrolledList(finalList);
    }

    fetchEnrolled(user.uid);
    
  }, [user])

  // TODO: 로그인 페이지 완성 후 제거할 것
  console.log("🔥 user.uid:", user?.uid);
  console.log("📚 enrolledList:", enrolledList);

  return (
    <article
      className={styles["enrolled-section"]}
      aria-labelledby="mypage-enrolled-title"
    >
      <h1
        id="mypage-enrolled-title"
        className={styles["enrolled-section__title"]}
      >
        수강 중인 강좌
      </h1>

      <div className={styles["enrolled-section__list"]}>
        {/* 아이템(정적 마크업) */}
        <div className={styles["enrolled-card"]}>
          <a
            href="/courses/placeholder"
            className={styles["enrolled__link"]}
          >
            <h3 className={styles["enrolled__title"]}>React 완전정복</h3>
            <p className={styles["enrolled__category"]}>
              프론트엔드 / React / 입문
            </p>
          </a>
          <div className={styles["progress"]} aria-label="진행률 60%">
            <div className={styles["progress__bar"]} style={{ width: "60%" }} />
          </div>
          <span className={styles["enrolled-card__percent"]}>60%</span>
        </div>

        <div className={styles["enrolled-card"]}>
          <a
            href="/courses/placeholder"
            className={styles["enrolled__link"]}
          >
            <h3 className={styles["enrolled__title"]}>TypeScript 기초</h3>
            <p className={styles["enrolled__category"]}>
              프론트엔드 / TypeScript / 중급
            </p>
          </a>
          <div className={styles["progress"]} aria-label="진행률 30%">
            <div className={styles["progress__bar"]} style={{ width: "30%" }} />
          </div>
          <span className={styles["enrolled-card__percent"]}>30%</span>
        </div>
      </div>
    </article>
  );
}
