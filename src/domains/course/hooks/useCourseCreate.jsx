import { createCourse } from '@/domains/course/services/courseService';
import { useState } from 'react';

export function useCourseCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const handleCourseCreate = async (user, formData, sections) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedId(null);

    try {
      const id = await createCourse(user, formData, sections);
      setCreatedId(id);
      setSuccess(true);
      return id;
    } catch (err) {
      console.error('useCourseCreate 실패:', err);
      setError(err.message || '강좌 등록 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCourse: handleCourseCreate, loading, error, success, createdId };
}
