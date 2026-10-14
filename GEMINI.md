# 프로젝트 개발 지침서 (GEMINI.md)

이 문서는 본 프로젝트의 웹 사이트 및 웹 앱 개발 시 Gemini CLI가 준수해야 할 핵심 설계 및 코딩 규칙을 정의합니다.

## 1. 기본 원칙 (Core Principles)
- 모바일 퍼스트(Mobile-First): 모든 UI/UX는 스마트폰 화면(기준 너비 375px~390px)을 기본으로 설계한 뒤, 태블릿 및 데스크톱으로 확장합니다.
- 가벼운 구조: 순수 HTML5, CSS3, 바닐라 JavaScript 구성을 기본값으로 채택합니다.
- 직관적 가독성: 초보자도 쉽게 읽고 유지보수할 수 있도록 코드 전반에 명확하고 친절한 한국어 주석을 작성합니다.

## 2. 반응형 레이아웃 및 뷰포트 기준
- 뷰포트 메타태그 필수: <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
- 표준 미디어 쿼리 분기점:
  - 모바일(기본): ~ 767px
  - 태블릿: 768px ~ 1023px
  - 데스크톱: 1024px 이상
- 유연한 단위 사용: 고정 px 대신 rem, %, vw/vh, clamp()를 우선 사용합니다.

## 3. 모바일 친화적 UI 컴포넌트 설계
- 터치 영역 확보: 버튼, 링크 등 터치 요소의 최소 높이/너비는 44px 이상으로 설정합니다.
- 핵심 모바일 기능: 화면 하단 고정 전화 상담/문의 플로팅 버튼(tel: 링크), 하단 네비게이션 바.
- 가로 스크롤 방지: box-sizing: border-box 및 overflow-x: hidden 기본 적용.

## 4. 코드 작성 및 응답 표준
- 한국어 주석 필수
- 이미지 alt 속성 및 외부 링크 rel="noopener noreferrer" 필수
- HTML, CSS, JS 파일 모듈 분리 작성
