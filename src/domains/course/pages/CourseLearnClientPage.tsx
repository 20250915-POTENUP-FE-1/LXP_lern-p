// src/domains/course/pages/CourseLearnClientPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Download,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import styles from '@/app/courses/[id]/learn/CourseLearnPage.module.css';
import type { LearnPageData } from '@/domains/course/types/learn';

type UILecture = {
  id: string;
  title: string;
  type: 'video' | 'pdf';
  duration?: string;
  description: string;
  completed: boolean;
  videoUrl?: string;
  pdfUrl?: string;
};

type UISection = {
  id: string;
  title: string;
  description: string;
  lectures: UILecture[];
};

type UICourse = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  sections: UISection[];
};

function formatDurationSeconds(seconds: number) {
  if (!seconds || seconds <= 0) return undefined;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function buildUICourseFromLearnData(learnData: LearnPageData): UICourse {
  const course = learnData.course;

  const baseDescription = course.description ?? '';
  const baseSummary = course.summary ?? '';

  const sections: UISection[] = course.sections.map((sec) => ({
    id: String(sec.sectionId),
    title: sec.title,
    description: '',
    lectures: sec.lectures.map((lec) => {
      const isVideo = lec.resource.resourceType === 'VIDEO';
      const fileUrl = lec.resource.fileUrl;

      return {
        id: String(lec.lectureId),
        title: lec.title,
        type: isVideo ? 'video' : 'pdf',
        duration: lec.duration ? formatDurationSeconds(lec.duration) : undefined,
        description:
          (isVideo ? baseDescription : '강의 자료를 다운로드해 학습을 보완하세요.') ||
          baseSummary ||
          '',
        completed: false, // TODO: progress 연동 시 true/false 처리
        videoUrl: isVideo ? fileUrl : undefined,
        pdfUrl: !isVideo ? fileUrl : undefined,
      };
    }),
  }));

  return {
    id: String(course.courseId),
    title: course.title,
    instructor: course.instructor.name,
    description: course.description ?? '',
    sections,
  };
}

type CourseLearnClientProps = {
  learnData: LearnPageData;
};

export default function CourseLearnClient({ learnData }: CourseLearnClientProps) {
  const courseData: UICourse = buildUICourseFromLearnData(learnData);

  const initialLecture =
    courseData.sections[0]?.lectures[0] ??
    ({
      id: 'placeholder',
      title: '준비 중인 강의입니다.',
      type: 'video',
      description: '',
      completed: false,
    } as UILecture);

  const [currentLecture, setCurrentLecture] = useState<UILecture>(initialLecture);
  const [openSections, setOpenSections] = useState<string[]>(
    courseData.sections[0] ? [courseData.sections[0].id] : [],
  );

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );
  };

  const handleLectureClick = (lecture: UILecture) => {
    setCurrentLecture(lecture);
  };

  const getTotalLectures = () => {
    return courseData.sections.reduce((acc, section) => acc + section.lectures.length, 0);
  };

  const getCompletedLectures = () => {
    return courseData.sections.reduce(
      (acc, section) => acc + section.lectures.filter((l) => l.completed).length,
      0,
    );
  };

  return (
    <div className={styles['course-learn']}>
      {/* 헤더 */}
      <header className={styles['course-learn__header']}>
        <div className={styles['course-learn__header-inner']}>
          <div className={styles['course-learn__header-left']}>
            <Link href="/">
              <button className={styles['course-learn__back-btn']} aria-label="back">
                <ArrowLeft className={styles['course-learn__icon']} />
              </button>
            </Link>
            <h1 className={styles['course-learn__title']}>{courseData.title}</h1>
          </div>
          <div className={styles['course-learn__progress']}>
            진도율: {getCompletedLectures()}/{getTotalLectures()} 완료
          </div>
        </div>
      </header>

      <div className={styles['course-learn__layout']}>
        {/* 메인 컨텐츠 영역 */}
        <main className={styles['course-learn__main']}>
          {/* 비디오/PDF 플레이어 */}
          <div className={styles['course-learn__player-wrap']}>
            {currentLecture.type === 'video' ? (
              <div className={styles['course-learn__player']}>
                <video
                  key={currentLecture.id}
                  className={styles['course-learn__video']}
                  controls
                  autoPlay
                >
                  {currentLecture.videoUrl && (
                    <source src={currentLecture.videoUrl} type="video/mp4" />
                  )}
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
            ) : (
              <div className={styles['course-learn__pdf-preview']}>
                <FileText className={styles['course-learn__pdf-preview__icon']} />
                <h3 className={styles['course-learn__pdf-preview__title']}>
                  {currentLecture.title}
                </h3>
                <p className={styles['course-learn__pdf-preview__desc']}>
                  {currentLecture.description}
                </p>
                {currentLecture.pdfUrl && (
                  <a href={currentLecture.pdfUrl} download>
                    <button className={styles['course-learn__brand-btn']}>
                      <Download className={styles['course-learn__icon']} />
                      PDF 다운로드
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 현재 강의 정보 */}
          <div className={styles['course-learn__info-card']}>
            <div className={styles['course-learn__info-row']}>
              {currentLecture.type === 'video' ? (
                <Play className={styles['course-learn__icon']} />
              ) : (
                <FileText className={styles['course-learn__icon']} />
              )}
              <span className={styles['course-learn__progress']}>
                {currentLecture.type === 'video' ? '영상 강의' : 'PDF 자료'}
                {currentLecture.duration && ` · ${currentLecture.duration}`}
              </span>
            </div>
            <h2 className={styles['course-learn__info-title']}>{currentLecture.title}</h2>
            <p className={styles['course-learn__pdf-preview__desc']}>
              {currentLecture.description}
            </p>
          </div>
        </main>

        {/* 사이드바 - 커리큘럼 */}
        <aside className={styles['course-learn__aside']}>
          <div className={styles['course-learn__curriculum']}>
            <h3 className={styles['course-learn__curriculum__title']}>커리큘럼</h3>
            <p className={styles['course-learn__curriculum__meta']}>
              {getTotalLectures()}개 강의 · {getCompletedLectures()}개 완료
            </p>
          </div>
          <div className={styles['course-learn__curriculum__list']}>
            {courseData.sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={styles['course-learn__section-btn']}
                >
                  <div className={styles['course-learn__section-info']}>
                    <h4 className={styles['course-learn__section-title']}>{section.title}</h4>
                    <p className={styles['course-learn__section-meta']}>
                      {section.lectures.length}개 강의
                    </p>
                  </div>
                  {openSections.includes(section.id) ? (
                    <ChevronDown className={styles['course-learn__icon']} />
                  ) : (
                    <ChevronRight className={styles['course-learn__icon']} />
                  )}
                </button>
                {openSections.includes(section.id) && (
                  <div className={styles['course-learn__section-content']}>
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        onClick={() => handleLectureClick(lecture)}
                        className={`${styles['course-learn__lecture-btn']} ${
                          currentLecture.id === lecture.id
                            ? styles['course-learn__lecture-btn--active']
                            : ''
                        }`}
                      >
                        <div className={styles['course-learn__lecture-icon']}>
                          {lecture.completed ? (
                            <CheckCircle className={styles['course-learn__icon']} />
                          ) : lecture.type === 'video' ? (
                            <Play className={styles['course-learn__icon']} />
                          ) : (
                            <FileText className={styles['course-learn__icon']} />
                          )}
                        </div>
                        <div className={styles['course-learn__lecture-text']}>
                          <p className={styles['course-learn__lecture-title']}>{lecture.title}</p>
                          <p className={styles['course-learn__lecture-meta']}>
                            {lecture.type === 'video' ? lecture.duration : 'PDF'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
