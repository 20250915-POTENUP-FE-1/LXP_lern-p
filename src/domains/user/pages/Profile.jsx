import styles from "@/domains/user/pages/MyPageSections.module.css";
import { auth } from "@/shared/lib/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

export default function Profile() {

  const [user, setUser] = useState(null); // 로그인 여부를 감지
  const [profile, setProfile] = useState(null); // Firestore 유저 정보 저장

  useEffect(() => {
    // onAuthStateChanged = 로그인 상태 변경 감지기 (로그인/로그아웃 변화를 감지해서 user 상태 업데이트)
    // getUserProfile = Firestore 데이터 가져오기
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser); // 로그인되면 user 상태에 값 들어감
      if(currentUser){
        const data = await getUserProfile(currentUser.uid);
        setProfile(data); // Firestore에서 유저 상세 정보 가져오기
      }
    })

    return () => unsubscribe(); // 언마운트 시 감시 종료 (CleanUp)
  }, [])

  // 로딩 추가
  if (!user || !profile) {
    return <div style={{ padding: "40px" }}>⏳ 내 정보 불러오는 중...</div>;
  }

  // createdAt 문자열, timeStamp 
  const createdAt = profile.createdAt;
  // Firestore Timestamp 형태: createdAt.toDate() 존재
  // 문자열 형태: new Date(createdAt) 변환
  const createdDate =
    createdAt instanceof Object && typeof createdAt.toDate === "function"
      ? createdAt.toDate()
      : new Date(createdAt);

  return (
    <article
      className={styles["profile-section"]}
      aria-labelledby="mypage-profile-title"
    >
      <div className={styles["profile-section__header"]}>
        <h1
          id="mypage-profile-title"
          className={styles["profile-section__title"]}
        >
          내 정보
        </h1>
        <div className={styles["profile__actions"]}>
          <a
            href="/mypage/edit"
            className={`${styles["profile__btn"]} ${styles["profile__btn--edit"]}`}
          >
            정보 수정
          </a>
        </div>
      </div>

      {/* 프로필 헤더 카드 */}
      <section
        className={styles["profile-section__header-card"]}
        aria-label="프로필 요약"
      >
        <div className={styles["profile-section__avatar"]} aria-hidden="true" />
        <div className={styles["profile-section__identity"]}>
          <h2 className={styles["profile-section__name"]}>{profile.name}님</h2>
          <p className={styles["profile-section__email"]}>{profile.email}</p>
          <p className={styles["profile-section__since"]}>가입일: {createdDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      {/* 상세 정보 카드 */}
      <div className={styles["profile-section__card"]}>
        <div className={styles["profile-section__row"]}>
          <span className={styles["profile-section__label"]}>이름</span>
          <span className={styles["profile-section__value"]}>{profile.name}</span>
        </div>
        <div
          className={styles["profile-section__divider"]}
          aria-hidden="true"
        />
        <div className={styles["profile-section__row"]}>
          <span className={styles["profile-section__label"]}>이메일</span>
          <span className={styles["profile-section__value"]}>
            {profile.email}
          </span>
        </div>
        <div
          className={styles["profile-section__divider"]}
          aria-hidden="true"
        />
        <div className={styles["profile-section__row"]}>
          <span className={styles["profile-section__label"]}>가입일</span>
          <span className={styles["profile-section__value"]}>
            {createdDate.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
