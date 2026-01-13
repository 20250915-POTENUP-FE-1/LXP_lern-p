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
import { useRouter, useSearchParams } from 'next/navigation';
import { useCourseLearn } from '@/domains/course/hooks/useCourseLearn';
import styles from '@/app/courses/[id]/learn/CourseLearnPage.module.css';
import { formatLectureDuration } from '@/domains/course/utils/formatDuration';
import { formatAbsoluteUrl } from '../utils/formatAbsoluteUrl';

type CourseLearnClientProps = {
  enrollmentId: string;
};

export default function CourseLearnClient({ enrollmentId }: CourseLearnClientProps) {
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
    handleVideoEnded,
    handleVideoTimeUpdate,
    handleLectureClick,
    markPdfCompleted,
    learnData,
  } = useCourseLearn(enrollmentId, { start });

  const lastVideoId = learnData?.progress?.lastVideoId ?? null;
  const lastWatchedDuration = learnData?.progress?.lastWatchedDuration ?? 0;

  const totalLectures = useMemo(() => {
    if (!courseData) return 0;
    return courseData.sections.reduce((acc, s) => acc + s.lectures.length, 0);
  }, [courseData]);

  const completedLectures = useMemo(() => {
    if (!courseData) return 0;
    return courseData.sections.flatMap((s) => s.lectures).filter((l) => l.completed).length;
  }, [courseData]);

  useEffect(() => {
    if (!currentLecture) return;
    hasSeekedRef.current = false;
  }, [currentLecture?.id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!currentLecture) return;
    if (!lastWatchedDuration) return;
    if (hasSeekedRef.current) return;

    if (lastVideoId !== currentLecture.id) return;

    const handleLoadedMetadata = () => {
      if (lastWatchedDuration < video.duration) {
        video.currentTime = lastWatchedDuration;
      }
      hasSeekedRef.current = true;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentLecture?.id, lastWatchedDuration, lastVideoId]);

  if (!courseData || !currentLecture) {
    return <div className={styles['course-learn__loading']}>강의를 불러오는 중입니다...</div>;
  }

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
          <div className={styles['course-learn__progress']}>
            진도율: {completedLectures}/{totalLectures} 완료
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
                  onEnded={handleVideoEnded}
                  onTimeUpdate={(e) => handleVideoTimeUpdate(e.currentTarget.currentTime)}
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
                      onClick={() => markPdfCompleted(currentLecture)}
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
