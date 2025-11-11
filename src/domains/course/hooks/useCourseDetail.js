// src/domains/course/hooks/useCourseDetail.js
import { db } from '@/shared/lib/firebase/firestore';
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

/**
 * 강의 상세 정보 조회 커스텀 훅
 * @param {string} courseId - URL에서 추출한 강의 ID
 * @returns {Object} { course, sections, lectures, loading }
 */
export function useCourseDetail(courseId) {
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lectures, setLectures] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const loadCourseData = async () => {
      try {
        // 강의 기본 정보 조회
        const courseSnap = await getDoc(doc(db, 'courses', courseId));

        if (!courseSnap.exists()) {
          setLoading(false);
          return;
        }

        const courseData = courseSnap.data();
        setCourse(courseData);

        if (import.meta.env.MODE === 'development') {
          const q = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
          const agg = await getCountFromServer(q);
          console.log(
            ` studentCount 캐시: ${courseData.studentCount ?? 0} / 실제 enrollments: ${agg.data().count}`,
          );
        }

        // 2 섹션 목록 조회
        const sectionSnap = await getDocs(collection(db, 'sections'));
        const allSections = sectionSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const courseSections = allSections
          .filter((sec) => sec.courseId === courseId)
          .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

        setSections(courseSections);

        // 3️ 강의 목록 조회
        const lectureSnap = await getDocs(collection(db, 'lectures'));
        const allLectures = lectureSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        const lectureMap = {};
        for (const sec of courseSections) {
          lectureMap[sec.id] = allLectures
            .filter((lec) => lec.sectionId === sec.id)
            .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
        }
        setLectures(lectureMap);
      } catch (error) {
        console.error('강의 데이터 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  return { course, sections, lectures, loading };
}
