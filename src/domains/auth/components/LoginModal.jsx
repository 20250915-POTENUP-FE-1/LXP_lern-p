import React from "react";

export function LoginModal() {
  return (
    <div
      id="login-modal"
      data-modal-root
      className="modal modal--login modal--narrow"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <a href="#" className="modal__overlay" aria-label="닫기" />
      <div className="modal__content modal__content--login" role="document">
        <header className="modal__header">
          <h2 id="login-modal-title" className="modal__title">
            로그인
          </h2>
          <a href="#" className="modal__close" aria-label="닫기">
            ×
          </a>
        </header>

        <div className="modal__body">
          <form className="modal__form" aria-label="로그인 폼">
            <div className="modal__field">
              <label htmlFor="li-email" className="modal__label">
                이메일
              </label>
              <input id="li-email" type="email" className="modal__input" />
            </div>
            <div className="modal__field">
              <label htmlFor="li-password" className="modal__label">
                비밀번호
              </label>
              <input
                id="li-password"
                type="password"
                className="modal__input"
              />
            </div>
          </form>
        </div>

        <footer className="modal__actions">
          
          <a href="#" className="modal__button">
            로그인
          </a>
          <div className="modal__actions--bottom">
            아직 계정이 없으신가요?
            <a className="modal__actions--link" href="/signup">
              회원가입
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
