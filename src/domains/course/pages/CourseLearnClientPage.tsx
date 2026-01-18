'use client';

import {
  ArrowLeft,
  Play,
  FileText,
  Download,
  ChevronDown,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCourseLearn } from '@/domains/course/hooks/useCourseLearn';
import { useProgress } from '@/domains/course/hooks/useProgress';
import styles from '@/app/courses/[id]/learn/CourseLearnPage.module.css';
import { formatLectureDuration } from '@/domains/course/utils/formatDuration';
import { formatAbsoluteUrl } from '../utils/formatAbsoluteUrl';
import { LearnEnrollmentResponse } from '../types/learn';

type CourseLearnClientProps = {
  enrollment: LearnEnrollmentResponse;
};

export default function CourseLearnClient({ enrollment }: CourseLearnClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasSeekedRef = useRef(false);

  const searchParams = useSearchParams();
  const rawStart = searchParams.get('start');
  const start = rawStart === 'first' ? 'first' : undefined;

  const {
    courseData,
    currentLecture,
    openSections,
    toggleSection,
    handleLectureClick,
    moveToNextLecture,
  } = useCourseLearn({ start });
  const { progressInfo, autoSaveProgress, saveFinalProgressOnEnd, lectureProgressMap } =
    useProgress(enrollment.courseId);

  const totalLectures = useMemo(() => {
    if (!courseData) return 0;
    return courseData.sections.reduce((acc, s) => acc + s.lectures.length, 0);
  }, [courseData]);

  const completedLectures = useMemo(() => {
    if (!courseData) return 0;

    return courseData.sections
      .flatMap((s) => s.lectures)
      .filter((lecture) => {
        const progress = lectureProgressMap.get(lecture.resourceId);
        return progress?.completed === true;
      }).length;
  }, [courseData, lectureProgressMap]);

  useEffect(() => {
    if (!currentLecture) return;
    hasSeekedRef.current = false;
  }, [currentLecture?.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!currentLecture) return;
    if (!progressInfo) return;
    if (hasSeekedRef.current) return;

    if (progressInfo.lectureId !== currentLecture.id) return;

    const handleLoadedMetadata = () => {
      if (progressInfo.resumeAt < video.duration) {
        video.currentTime = progressInfo.resumeAt;
      }
      hasSeekedRef.current = true;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentLecture?.id, progressInfo]);

  if (!courseData || !currentLecture) {
    return <div className={styles['course-learn__loading']}>강의를 불러오는 중입니다...</div>;
  }

  return (
    <div className={styles['course-learn']}>
      <header className={styles['course-learn__header']}>
        <div className={styles['course-learn__header-inner']}>
          <div className={styles['course-learn__header-left']}>
            <button
              className={styles['course-learn__back-btn']}
              aria-label="back"
              onClick={() => router.back()}
            >
              <ArrowLeft className={styles['course-learn__icon']} />
            </button>
            <h1 className={styles['course-learn__title']}>{courseData.title}</h1>
          </div>
          <div className={styles['course-learn__header-right']}>
            <div className={styles['course-learn__progress']}>
              진도율: {completedLectures}/{totalLectures} 완료
            </div>
            <Link
              className={styles['course-learn__detail-button']}
              href={`/courses/${courseData.courseId}`}
            >
              강좌 상세 보기
            </Link>
          </div>
        </div>
      </header>

      <div className={styles['course-learn__layout']}>
        <main className={styles['course-learn__main']}>
          <div className={styles['course-learn__player-wrap']}>
            {currentLecture.type === 'VIDEO' &&
            currentLecture.videoUrl &&
            formatAbsoluteUrl(currentLecture.videoUrl) ? (
              <div className={styles['course-learn__player']}>
                <video
                  className={styles['course-learn__video']}
                  ref={videoRef}
                  key={currentLecture.id}
                  controls
                  autoPlay
                  onEnded={() => {
                    if (!currentLecture.duration) return;
                    saveFinalProgressOnEnd(currentLecture.resourceId, currentLecture.duration);
                    moveToNextLecture();
                  }}
                  onTimeUpdate={(e) => {
                    autoSaveProgress(
                      currentLecture.resourceId,
                      Math.floor(e.currentTarget.currentTime),
                    );
                  }}
                >
                  <source src={formatAbsoluteUrl(currentLecture.videoUrl)} type="video/mp4" />
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
                  <a href={formatAbsoluteUrl(currentLecture.pdfUrl)} download>
                    <button
                      onClick={() => saveFinalProgressOnEnd(currentLecture.id, 0)}
                      className={styles['course-learn__brand-btn']}
                    >
                      <Download className={styles['course-learn__icon']} /> PDF 다운로드
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className={styles['course-learn__info-card']}>
            <div className={styles['course-learn__info-row']}>
              {currentLecture.type === 'VIDEO' ? (
                <Play className={styles['course-learn__icon']} />
              ) : (
                <FileText className={styles['course-learn__icon']} />
              )}
              <span className={styles['course-learn__progress']}>
                {currentLecture.type === 'VIDEO' ? '영상 강의' : 'PDF 자료'}
                {currentLecture.duration && ` · ${formatLectureDuration(currentLecture.duration)}`}
              </span>
            </div>
            <h2 className={styles['course-learn__info-title']}>{currentLecture.title}</h2>
            <p className={styles['course-learn__pdf-preview__desc']}>
              {currentLecture.description}
            </p>
          </div>
        </main>

        <aside className={styles['course-learn__aside']}>
          <div className={styles['course-learn__curriculum']}>
            <h3 className={styles['course-learn__curriculum__title']}>커리큘럼</h3>
            <p className={styles['course-learn__curriculum__meta']}>
              {totalLectures}개 강의 · {completedLectures}개 완료
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
                    {section.lectures.map((lecture) => {
                      const progress = lectureProgressMap.get(lecture.resourceId);
                      const completed = progress?.completed === true;

                      return (
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
                            {completed ? (
                              <CheckCircle className={styles['course-learn__icon']} />
                            ) : lecture.type === 'VIDEO' ? (
                              <Play className={styles['course-learn__icon']} />
                            ) : (
                              <FileText className={styles['course-learn__icon']} />
                            )}
                          </div>

                          <div className={styles['course-learn__lecture-text']}>
                            <p className={styles['course-learn__lecture-title']}>{lecture.title}</p>
                            <p className={styles['course-learn__lecture-meta']}>
                              {lecture.type === 'VIDEO'
                                ? formatLectureDuration(lecture.duration)
                                : 'PDF'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
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
