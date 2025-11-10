// src/pages/admin/SeedDataPage.jsx
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../../../shared/lib/firebase/config';

export default function SeedDataPage() {
  const [status, setStatus] = useState('idle'); // idle | seeding | done | error
  const [msg, setMsg] = useState('');
  const ranRef = useRef(false); // React.StrictMode 2회 실행 차단
  const auth = getAuth();

  async function ensureAuth() {
    return new Promise((resolve, reject) => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        try {
          if (!user) {
            await signInAnonymously(auth); // 규칙이 "로그인만 허용"이면 이걸로 통과
          }
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          unsub();
        }
      });
    });
  }

  async function seedOnce() {
    if (ranRef.current) return; // StrictMode 대비
    ranRef.current = true;

    setStatus('seeding');
    setMsg('시드 시작…');

    try {
      // ====== 사전 진단 ======
      if (!db || !db._app || !db._app.options?.projectId) {
        throw new Error('Firestore 인스턴스(db) 설정이 올바르지 않습니다. firebase/config 확인.');
      }
      const projectId = db._app.options.projectId;
      console.log('[seed] projectId:', projectId);

      // 1) 인증 확보 (익명)
      await ensureAuth();
      const uid = auth.currentUser?.uid || '(no user)';
      console.log('[seed] auth uid:', uid);

      // 2) 이미 시드 여부 체크
      //const markRef = doc(db, '_seed_marks', 'initial_v1');
      const markRef = doc(db, '_seed_marks', 'initial_v2');
      const markSnap = await getDoc(markRef);
      if (markSnap.exists()) {
        setStatus('done');
        setMsg('이미 시드됨(마커 존재). 스킵.');
        return;
      }

      // ====== 실제 시드 ======
      await setDoc(doc(db, 'users', 'u_001'), {
        id: 'u_001',
        email: 'user@example.com',
        name: '홍길동',
        roles: ['USER'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

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
        studentCount: 0,
        duration: 120,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'sections', 'sec_01'), {
        id: 'sec_01',
        courseId: 'c_101',
        title: '섹션 1: 시작하기',
        sequence: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'lectures', 'lec_001'), {
        id: 'lec_001',
        sectionId: 'sec_01',
        courseId: 'c_101',
        title: 'OT 및 소개',
        videoUrl: '',
        duration: 5,
        sequence: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'enrollments', 'u_001_c_101'), {
        id: 'u_001_c_101',
        userId: 'u_001',
        courseId: 'c_101',
        progress: 0,
        enrolledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      await setDoc(doc(db, 'carts', 'u_001_c_101'), {
        id: 'u_001_c_101',
        userId: 'u_001',
        courseId: 'c_101',
        addedAt: serverTimestamp(),
      });

      await setDoc(markRef, {
        createdAt: serverTimestamp(),
        note: 'initial seed v2',
        by: uid,
      });

      setStatus('done');
      setMsg('✅ 시드 완료');
    } catch (err) {
      console.error('Seed error:', err);
      setStatus('error');
      // 코드/메시지 노출(권한 문제면 여기서 바로 보임)
      setMsg(`❌ ${err.code || ''} ${err.message || err.toString()}`);
    }
  }

  useEffect(() => {
    seedOnce(); // 자동 실행 (1회)
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>초기 데이터 세팅</h1>
      <p>status: {status}</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{msg}</pre>
      <button
        onClick={seedOnce}
        disabled={status === 'seeding'}
        style={{ padding: '8px 16px', marginTop: 12 }}
      >
        다시 실행
      </button>
    </div>
  );
}
