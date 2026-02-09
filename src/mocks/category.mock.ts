import type { Category } from '@/domains/course/types/course';

export const MOCK_CATEGORIES: Category[] = [
  { categoryId: 0, name: '전체', children: [] },
  {
    categoryId: 1,
    name: '드로잉',
    children: [
      { categoryId: 101, name: '기초 드로잉' },
      { categoryId: 102, name: '수채화' },
      { categoryId: 103, name: '인물화' },
      { categoryId: 104, name: '아이패드 드로잉' },
      { categoryId: 105, name: '프로크리에이트' },
      { categoryId: 106, name: '캐릭터 일러스트' },
    ],
  },
  {
    categoryId: 2,
    name: '공예',
    children: [
      { categoryId: 201, name: '도예' },
      { categoryId: 202, name: '가죽공예' },
      { categoryId: 203, name: '자수·뜨개' },
      { categoryId: 204, name: '캔들·비누' },
    ],
  },
  {
    categoryId: 3,
    name: '요리·음료',
    children: [
      { categoryId: 301, name: '한식' },
      { categoryId: 302, name: '베이킹' },
      { categoryId: 303, name: '커피·디저트' },
      { categoryId: 304, name: '음료·칵테일' },
    ],
  },
  {
    categoryId: 4,
    name: '음악',
    children: [
      { categoryId: 401, name: '보컬' },
      { categoryId: 402, name: '기타' },
      { categoryId: 403, name: '피아노' },
      { categoryId: 404, name: '작곡·미디' },
    ],
  },
  {
    categoryId: 5,
    name: '사진·영상',
    children: [
      { categoryId: 501, name: '사진 촬영' },
      { categoryId: 502, name: '영상 편집' },
      { categoryId: 503, name: '유튜브 촬영·운영' },
    ],
  },
  {
    categoryId: 6,
    name: '금융·재테크',
    children: [
      { categoryId: 601, name: '주식·ETF' },
      { categoryId: 602, name: '부동산' },
      { categoryId: 603, name: '가계부·예산관리' },
      { categoryId: 604, name: '세금·절세' },
    ],
  },
  {
    categoryId: 7,
    name: '창업·부업',
    children: [
      { categoryId: 701, name: '스마트스토어' },
      { categoryId: 702, name: '쿠팡파트너스' },
      { categoryId: 703, name: '브랜딩·SNS 마케팅' },
    ],
  },
  {
    categoryId: 8,
    name: '성공마인드',
    children: [
      { categoryId: 801, name: '자기계발' },
      { categoryId: 802, name: '시간관리' },
      { categoryId: 803, name: '업무 효율화' },
    ],
  },
  {
    categoryId: 9,
    name: 'AI스킬업',
    children: [
      { categoryId: 901, name: 'ChatGPT' },
      { categoryId: 902, name: '생성형 AI' },
      { categoryId: 903, name: 'AI 자동화' },
    ],
  },
  {
    categoryId: 10,
    name: '프로그래밍',
    children: [
      { categoryId: 1001, name: '웹개발' },
      { categoryId: 1002, name: '프론트엔드' },
      { categoryId: 1003, name: '백엔드' },
      { categoryId: 1004, name: '모바일 앱' },
      { categoryId: 1005, name: '알고리즘·자료구조' },
    ],
  },
  {
    categoryId: 11,
    name: '데이터사이언스',
    children: [
      { categoryId: 1101, name: '데이터 분석' },
      { categoryId: 1102, name: '파이썬 데이터' },
      { categoryId: 1103, name: '머신러닝' },
      { categoryId: 1104, name: '딥러닝' },
    ],
  },
  {
    categoryId: 12,
    name: '기획',
    children: [
      { categoryId: 1201, name: 'UX 기획' },
      { categoryId: 1202, name: '서비스 기획' },
      { categoryId: 1203, name: '프로덕트 매니지먼트' },
    ],
  },
  {
    categoryId: 13,
    name: '비즈니스',
    children: [
      { categoryId: 1301, name: '프로젝트 관리' },
      { categoryId: 1302, name: '스타트업 운영' },
      { categoryId: 1303, name: 'OKR·성과 관리' },
    ],
  },
  {
    categoryId: 14,
    name: '생산성',
    children: [
      { categoryId: 1401, name: '노션·툴 활용' },
      { categoryId: 1402, name: '자동화·매크로' },
      { categoryId: 1403, name: '업무 효율화' },
    ],
  },
  {
    categoryId: 15,
    name: '마케팅',
    children: [
      { categoryId: 1501, name: '디지털 마케팅' },
      { categoryId: 1502, name: '광고·퍼포먼스' },
      { categoryId: 1503, name: '콘텐츠 마케팅' },
      { categoryId: 1504, name: 'SNS 브랜딩' },
    ],
  },
  {
    categoryId: 16,
    name: '디자인',
    children: [
      { categoryId: 1601, name: 'UX/UI 디자인' },
      { categoryId: 1602, name: '그래픽 디자인' },
      { categoryId: 1603, name: '피그마·포토샵' },
    ],
  },
  {
    categoryId: 17,
    name: '영상3D',
    children: [
      { categoryId: 1701, name: '프리미어 프로' },
      { categoryId: 1702, name: '애프터이펙트' },
      { categoryId: 1703, name: '3D 모델링·블렌더' },
    ],
  },
  {
    categoryId: 18,
    name: '영어',
    children: [
      { categoryId: 1801, name: '회화' },
      { categoryId: 1802, name: '비즈니스 영어' },
      { categoryId: 1803, name: '발음·리스닝' },
      { categoryId: 1804, name: '문법·독해' },
    ],
  },
  {
    categoryId: 19,
    name: '외국어시험',
    children: [
      { categoryId: 1901, name: '토익' },
      { categoryId: 1902, name: '토플' },
      { categoryId: 1903, name: '오픽' },
      { categoryId: 1904, name: '아이엘츠' },
      { categoryId: 1905, name: 'JLPT' },
      { categoryId: 1906, name: 'HSK' },
      { categoryId: 1907, name: '기타 시험' },
    ],
  },
  {
    categoryId: 20,
    name: '제2외국어',
    children: [
      { categoryId: 2001, name: '일본어' },
      { categoryId: 2002, name: '중국어' },
      { categoryId: 2003, name: '스페인어' },
      { categoryId: 2004, name: '프랑스어' },
    ],
  },
];
