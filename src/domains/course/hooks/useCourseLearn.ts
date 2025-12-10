'use client';

import { useMemo, useState, useCallback } from 'react';
import type { LearnPageData, UICourse, UILecture } from '@/domains/course/types/learn';
import { createLearnPageUIModel } from '../utils/createLearnPageUIModel';

export type UseCourseLearnReturn = {
  courseData: UICourse;
  currentLecture: UILecture;
  openSections: string[];
  toggleSection: (sectionId: string) => void;
  handleLectureClick: (lecture: UILecture) => void;
  totalLectures: number;
  completedLectures: number;
};

export function useCourseLearn(learnData: LearnPageData): UseCourseLearnReturn {
  const courseData = useMemo(() => createLearnPageUIModel(learnData), [learnData]);

  const initialLecture = useMemo<UILecture>(() => {
    return (
      courseData.sections[0]?.lectures[0] ?? {
        id: 'placeholder',
        title: '준비 중인 강의입니다.',
        type: 'VIDEO',
        description: '',
        completed: false,
      }
    );
  }, [courseData]);

  const [currentLecture, setCurrentLecture] = useState<UILecture>(initialLecture);
  const [openSections, setOpenSections] = useState<string[]>(
    courseData.sections[0] ? [courseData.sections[0].id] : [],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );
  }, []);

  const handleLectureClick = useCallback((lecture: UILecture) => {
    setCurrentLecture(lecture);
  }, []);

  const totalLectures = useMemo(
    () => courseData.sections.reduce((acc, section) => acc + section.lectures.length, 0),
    [courseData],
  );

  const completedLectures = useMemo(
    () =>
      courseData.sections.reduce(
        (acc, section) => acc + section.lectures.filter((l) => l.completed).length,
        0,
      ),
    [courseData],
  );

  return {
    courseData,
    currentLecture,
    openSections,
    toggleSection,
    handleLectureClick,
    totalLectures,
    completedLectures,
  };
}
