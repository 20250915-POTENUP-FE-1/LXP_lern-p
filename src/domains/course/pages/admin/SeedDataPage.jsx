// src/pages/admin/SeedDataPage.jsx
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../shared/lib/firebase/config';
export default function SeedDataPage() {
  const seedData = async () => {
    try {
      // User 추가
      await setDoc(doc(db, 'users', 'u_001'), {
        id: 'u_001',
        email: 'user@example.com',
        name: '홍길동',
        roles: ['USER'],
        cart: ['c_101'],
        enrolledCourses: [{ courseId: 'c_101', progress: 0, enrolledAt: new Date().toISOString() }],
        createdCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Course 추가
      await setDoc(doc(db, 'courses', 'c_101'), {
        id: 'c_101',
        title: 'React 입문',
        summary: '리액트 기초를 쉽게 배우는 강의입니다.',
        description: '이 강의는 React의 기초 개념과 JSX, 컴포넌트 등을 다룹니다.',
        thumbnailUrl: '',
        instructorId: 'u_001',
        instructorName: '홍길동',
        category: ['프로그래밍', '웹', '프론트엔드'],
        level: '초급',
        tags: ['프론트엔드', '초급'],
        price: 45000,
        isFree: false,
        studentCount: 123,
        duration: 120,
        status: 'published',
        sectionIds: ['sec_01'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Section 추가
      await setDoc(doc(db, 'sections', 'sec_01'), {
        id: 'sec_01',
        courseId: 'c_101',
        title: '섹션 1: 시작하기',
        sequence: 1,
        lectureIds: ['lec_001'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Lecture 추가
      await setDoc(doc(db, 'lectures', 'lec_001'), {
        id: 'lec_001',
        sectionId: 'sec_01',
        courseId: 'c_101',
        title: 'OT 및 소개',
        videoUrl: '',
        duration: 5,
        sequence: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      alert('✅ 모든 데이터 추가 완료!');
    } catch (error) {
      console.error('데이터 추가 실패:', error);
      alert('❌ 실패: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>초기 데이터 세팅</h1>
      <button onClick={seedData} style={{ padding: '10px 20px', fontSize: '16px' }}>
        데이터 추가 실행
      </button>
    </div>
  );
}
