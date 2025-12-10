import type { Section, Lecture, SectionDraft, CourseDraft } from '../types/course';
import { API_BASE, handleResponse, getCourse } from './courseService';

// ===== 6. 임시 강좌 기본 정보 수정 =====
export const updateDraftCourse = async (courseId: string, data: CourseDraft): Promise<void> => {
  if (!courseId) throw new Error('Invalid course ID');

  try {
    await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        summary: data.summary,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        level: data.level,
        price: Number(data.price),
        isFree: Number(data.price) === 0,
        tags: [data.level || '', data.category?.[0] || ''],
        updatedAt: new Date().toISOString(),
      }),
    }).then((res) => handleResponse(res));
  } catch (err) {
    console.error('updateDraftCourse 실패:', err);
    throw new Error('임시 강좌 수정 중 오류가 발생했습니다.');
  }
};

// ===== 7. 섹션/강의 전체 갈아끼우기 =====
export const updateDraftSection = async (
  courseId: string,
  sectionDrafts: SectionDraft[],
): Promise<void> => {
  if (!courseId) throw new Error('Invalid course ID');

  try {
    // 1) 기존 섹션 조회
    const sectionsRes = await fetch(`${API_BASE}/sections?courseId=${courseId}`);
    const sections = await handleResponse<Section[]>(sectionsRes);

    // 2) 기존 섹션의 강의들 먼저 삭제
    for (const sec of sections) {
      const lecturesRes = await fetch(`${API_BASE}/lectures?sectionId=${sec.id}`);
      const lectures = await handleResponse<Lecture[]>(lecturesRes);

      for (const lec of lectures) {
        await fetch(`${API_BASE}/lectures/${lec.id}`, { method: 'DELETE' });
      }
    }

    // 3) 기존 섹션 삭제
    for (const sec of sections) {
      await fetch(`${API_BASE}/sections/${sec.id}`, { method: 'DELETE' });
    }

    // 4) 새 섹션/강의 생성
    let totalDuration = 0;
    const sectionIds: string[] = [];

    for (let i = 0; i < sectionDrafts.length; i++) {
      const secDraft = sectionDrafts[i];

      // 섹션 생성
      const sectionRes = await fetch(`${API_BASE}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          title: secDraft.title,
          sequence: i + 1,
          lectures: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      const newSection = await handleResponse<Section>(sectionRes);
      sectionIds.push(newSection.id);

      const lectureIds: string[] = [];

      // 강의 생성
      for (let j = 0; j < secDraft.lectures.length; j++) {
        const lecDraft = secDraft.lectures[j];

        const lectureRes = await fetch(`${API_BASE}/lectures`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sectionId: newSection.id,
            courseId,
            title: lecDraft.title,
            videoUrl: lecDraft.videoUrl || '',
            duration: lecDraft.duration || 0,
            isPreview: lecDraft.isPreview || false,
            resource: lecDraft.resource || {
              resourceType: 'VIDEO',
              isDownloadable: false,
              fileUrl: lecDraft.videoUrl || '',
            },
            sequence: j + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        });
        const newLecture = await handleResponse<Lecture>(lectureRes);
        lectureIds.push(newLecture.id);
        totalDuration += lecDraft.duration || 0;
      }

      // 섹션에 강의 ID 업데이트
      await fetch(`${API_BASE}/sections/${newSection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lectures: lectureIds }),
      });
    }

    // 5) 강좌 메타데이터 업데이트
    await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sections: sectionIds,
        duration: totalDuration,
        updatedAt: new Date().toISOString(),
      }),
    });
  } catch (err) {
    console.error('updateDraftSection 실패:', err);
    throw new Error('임시 강좌 섹션 수정 중 오류가 발생했습니다.');
  }
};

export const fetchCourseWithSections = async (
  courseId: string,
): Promise<{
  courseDraft: CourseDraft;
  sectionDrafts: SectionDraft[];
}> => {
  const { course, sections, lectures } = await getCourse(courseId);

  if (!course) {
    throw new Error('강좌 정보를 찾을 수 없습니다.');
  }

  const courseDraft: CourseDraft = {
    title: course.title,
    summary: course.summary,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    category: course.category,
    level: course.level,
    price: course.price,
  };

  const sectionDrafts: SectionDraft[] = sections.map((sec) => ({
    id: sec.id,
    title: sec.title,
    lectures: (lectures[sec.id] || []).map((lec) => ({
      id: lec.id,
      title: lec.title,
      duration: lec.duration,
      videoUrl: lec.videoUrl,
      isPreview: lec.isPreview || false,
      resource: lec.resource || {
        resourceType: 'VIDEO',
        isDownloadable: false,
        fileUrl: lec.videoUrl,
      },
    })),
  }));

  return { courseDraft, sectionDrafts };
};

export const fetchCourseData = async (courseId: string): Promise<CourseDraft> => {
  const { course } = await getCourse(courseId);

  if (!course) {
    throw new Error('강좌를 찾을 수 없습니다.');
  }

  return {
    title: course.title,
    summary: course.summary,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    category: course.category,
    level: course.level,
    price: course.price,
  };
};
