# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## LXP 스타일 시스템 정리
- src/app: 전역 토큰·레이어·반응형 변수를 `global.css`로 통합하고, 라이트 기본/다크 `data-theme="dark"` 토글과 모달 기저·리셋·포커스 링을 재정의했습니다.
- src/shared/ui: 헤더를 `header__action--*` 패턴으로 재작성하고 토큰 기반의 스티키 네비게이션으로 통일했습니다.
- src/layouts: `app-shell`/`auth-shell` 레이아웃을 다크 테마 토큰과 일관된 여백 시스템으로 정비했습니다.
- src/domains/auth: 인증 폼을 `auth-page__*` BEM으로 맞추고 입력/버튼을 토큰 기반으로 재설계했습니다.
- src/domains/course/components: 카드·폼·필터·CTA 등 모든 컴포넌트를 `block__element--modifier`로 정렬하고 브랜드 톤/간격 토큰을 사용합니다.
- src/domains/course/pages: 목록/상세/등록 페이지 그리드를 480·768·1200px 모바일 퍼스트 브레이크포인트로 재구성했습니다.
- src/domains/user: 마이페이지 사이드바·프로필·수강 섹션을 다크 테마 카드 스타일과 BEM 네이밍으로 통합했습니다.

<!-- Snapshot Test Checklist:
1. 로그인 모달: 모바일/태블릿/데스크톱에서 열림 상태(`:target`, `.modal--open`) 확인 및 포커스 이동/스크롤 잠금 점검.
2. 강좌 등록 모달(역할 요청 포함): 오버레이 겹침과 버튼 토큰 스타일 유지, 입력 포커스 링 확인.
3. 에러/기타 모달: 전역 `.modal` 기저 적용 여부, z-index 충돌 및 배경 스크롤 차단 확인.
-->
