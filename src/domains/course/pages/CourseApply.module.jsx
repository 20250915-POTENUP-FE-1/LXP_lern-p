// 신청 모달 로직
{
  showLoginModal && (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3 className="modal-title">로그인이 필요합니다</h3>
        <p className="modal-desc">수강을 진행하려면 로그인해주세요.</p>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={() => setShowLoginModal(false)}>
            취소
          </button>
          <button type="button" className="btn-primary" onClick={() => navigate('/signin')}>
            로그인 하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

{
  /* ===== 수강 신청 확인 모달 (로그인 사용자용) ===== */
}
{
  showEnrollModal && (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3 className="modal-title">강좌 신청 확인</h3>

        <ul className="confirm-list">
          <li>
            <span className="label">강좌</span>
            <span className="value">{course.title}</span>
          </li>
          <li>
            <span className="label">요약</span>
            <span className="value">{course.summary || '요약 정보 없음'}</span>
          </li>
          <li>
            <span className="label">강사명</span>
            <span className="value">{course.instructorName}</span>
          </li>
          <li>
            <span className="label">커리큘럼 수</span>
            <span className="value">총 {totalLectures}강</span>
          </li>
          <li>
            <span className="label">총 강의 시간</span>
            <span className="value">
              {totalMinutes > 0 ? formatMinutes(totalMinutes) : `${course.duration}분`}
            </span>
          </li>
          <li>
            <span className="label">난이도</span>
            <span className="value">{course.level}</span>
          </li>
        </ul>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={() => setShowEnrollModal(false)}>
            취소
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              // TODO: 실제 신청 로직 (enrollments 컬렉션에 addDoc 등)
              // 예) await addDoc(collection(db, 'enrollments'), { userId: currentUser.uid, courseId, ... })
              setShowEnrollModal(false);
              alert('신청이 완료되었습니다.');
            }}
          >
            신청
          </button>
        </div>
      </div>
    </div>
  );
}
