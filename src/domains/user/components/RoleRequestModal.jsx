import React from "react";

export function RoleRequestModal() {
  return (
    <div
      id="role-request-modal"
      data-modal-root
      data-size="lg"
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-request-title"
    >
      <a href="#" className="modal__overlay" aria-label="닫기" />
      <div className="modal__content" role="document">
        <header className="modal__header">
          <h2 id="role-request-title" className="modal__title">
            강사 권한 요청
          </h2>
          <a href="#" className="modal__close" aria-label="닫기">
            ×
          </a>
        </header>
        <div className="modal__body">
          <form className="modal__form" aria-label="강사 권한 요청 폼">
            <div className="modal__field">
              <label htmlFor="rr-name" className="modal__label">
                이름
              </label>
              <input id="rr-name" type="text" className="modal__input" />
            </div>
            <div className="modal__field">
              <label htmlFor="rr-portfolio" className="modal__label">
                포트폴리오 URL
              </label>
              <input
                id="rr-portfolio"
                type="url"
                className="modal__input"
                placeholder="https://..."
              />
            </div>
            <div className="modal__field">
              <label htmlFor="rr-message" className="modal__label">
                요청 사유
              </label>
              <textarea id="rr-message" rows="4" className="modal__textarea" />
            </div>
          </form>
        </div>
        <footer className="modal__footer">
          <a href="#" className="modal__btn">
            요청 보내기
          </a>
          <a href="#" className="modal__btn modal__btn--ghost">
            취소
          </a>
        </footer>
      </div>
    </div>
  );
}
