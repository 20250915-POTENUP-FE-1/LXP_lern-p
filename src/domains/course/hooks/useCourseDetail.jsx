import { useEffect, useState } from 'react';
import { getCourse } from '../services/courseService';

/**
 * 강좌 상세 정보 + 섹션 + 강의 목록을 가져오는 훅
 * @param {string} courseId
 * @returns {{ course: object|null, sections: Array, lectures: object, loading: boolean }}
 */
export function useCourseDetail(courseId) {
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lectures, setLectures] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const { course, sections, lectures } = await getCourse(courseId);
        setCourse(course);
        setSections(sections);
        setLectures(lectures);
      } catch (err) {
        console.error('강좌 상세 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  return { course, sections, lectures, loading };
}
