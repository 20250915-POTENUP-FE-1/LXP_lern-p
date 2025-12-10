import type { User } from '@/domains/user/types/user';
import type { Course, CourseDraft, SectionDraft } from '../types/course';
import { API_BASE, handleResponse } from './courseService';
import { updateDraftSection } from './courseEditService';

export const createDraftCourse = async (user: User, draftData: CourseDraft): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    const requestData = {
      title: draftData.title,
      summary: draftData.summary,
      description: draftData.description,
      thumbnailUrl: draftData.thumbnailUrl || '',
      instructorId: user.id,
      category: draftData.category,
      level: draftData.level,
      tags: [draftData.level || '', draftData.category?.[0] || ''],
      price: Number(draftData.price),
      isFree: Number(draftData.price) === 0,
      studentCount: 0,
      duration: 0,
      status: 'draft',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    const data = await handleResponse<Course>(response);

    return data.id;
  } catch (err) {
    console.error('createDraftCourse 실패:', err);
    throw new Error('임시 강좌 생성 중 오류가 발생했습니다.');
  }
};

export const publishDraftCourse = async (courseId: string): Promise<void> => {
  if (!courseId) throw new Error('Invalid course ID');

  try {
    await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'published',
        updatedAt: new Date().toISOString(),
      }),
    }).then((res) => handleResponse(res));
  } catch (err) {
    console.error('publishDraftCourse 실패:', err);
    throw new Error('강좌 발행 중 오류가 발생했습니다.');
  }
};

export const createCourse = async (
  user: User,
  courseDraft: CourseDraft,
  sectionDrafts: SectionDraft[],
  shouldPublish: boolean = false,
): Promise<string> => {
  if (!user?.id) throw new Error('로그인이 필요합니다.');

  try {
    const draftId = await createDraftCourse(user, courseDraft);
    await updateDraftSection(draftId, sectionDrafts);

    if (shouldPublish) {
      await publishDraftCourse(draftId);
    }

    return draftId;
  } catch (err) {
    console.error('createCourse 실패:', err);
    throw new Error('강좌 등록 중 오류가 발생했습니다.');
  }
};
