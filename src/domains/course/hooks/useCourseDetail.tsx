import { useEffect, useState } from 'react';
import { getCourse } from '../services/courseService';
import { CourseDetailResponse } from '../types/course';

export function useCourseDetail(courseId: string) {
  const [courseData, setCourseData] = useState<CourseDetailResponse>({
    course: null,
    sections: [],
    lectures: {},
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const data = await getCourse(courseId);
        setCourseData(data);
      } catch (err) {
        console.error('강좌 상세 정보 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  return {
    ...courseData,
    loading,
  };
}
