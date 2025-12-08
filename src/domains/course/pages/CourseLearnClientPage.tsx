"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Play, FileText, Download, CheckCircle, ArrowLeft } from "lucide-react";
import styles from '@/app/courses/[id]/learn/CourseLearnPage.module.css';


type Lecture = {
  id: string;
  title: string;
  type: "video" | "pdf";
  duration?: string;
  description: string;
  completed: boolean;
  videoUrl?: string;
  pdfUrl?: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  lectures: Lecture[];
};

type Course = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  sections: Section[];
};

// 더미 데이터
const courseData: Course = {
  id: "1",
  title: "에헴",
  instructor: "lee2 강사",
  description: "테스트 입니다",
  sections: [
    {
      id: "s1",
      title: "섹션 1: 시작하기",
      description: "강좌의 기본적인 내용을 소개합니다.",
      lectures: [
        {
          id: "l1",
          title: "강좌 소개",
          type: "video",
          duration: "10:30",
          description: "이 강좌에서 배울 내용에 대해 알아봅니다.",
          completed: true,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
        {
          id: "l2",
          title: "학습 자료 다운로드",
          type: "pdf",
          description: "강좌에서 사용할 학습 자료입니다.",
          completed: false,
          pdfUrl: "/sample.pdf",
        },
      ],
    },
    {
      id: "s2",
      title: "섹션 2: 기초 개념",
      description: "핵심 개념들을 학습합니다.",
      lectures: [
        {
          id: "l3",
          title: "기초 개념 1",
          type: "video",
          duration: "15:20",
          description: "첫 번째 기초 개념에 대해 배웁니다.",
          completed: false,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
        {
          id: "l4",
          title: "기초 개념 2",
          type: "video",
          duration: "12:45",
          description: "두 번째 기초 개념에 대해 배웁니다.",
          completed: false,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
        {
          id: "l5",
          title: "기초 개념 정리 자료",
          type: "pdf",
          description: "기초 개념을 정리한 PDF 자료입니다.",
          completed: false,
          pdfUrl: "/sample.pdf",
        },
      ],
    },
    {
      id: "s3",
      title: "섹션 3: 심화 학습",
      description: "더 깊은 내용을 학습합니다.",
      lectures: [
        {
          id: "l6",
          title: "심화 주제 1",
          type: "video",
          duration: "20:00",
          description: "심화 주제에 대해 학습합니다.",
          completed: false,
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      ],
    },
  ],
};

export default function CourseLearnPage() {
  const [currentLecture, setCurrentLecture] = useState<Lecture>(courseData.sections[0].lectures[0]);
  const [openSections, setOpenSections] = useState<string[]>(["s1"]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]));
  };

  const handleLectureClick = (lecture: Lecture) => {
    setCurrentLecture(lecture);
  };

  const getTotalLectures = () => {
    return courseData.sections.reduce((acc, section) => acc + section.lectures.length, 0);
  };

  const getCompletedLectures = () => {
    return courseData.sections.reduce((acc, section) => acc + section.lectures.filter((l) => l.completed).length, 0);
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
            {currentLecture.type === "video" ? (
              <div className={styles['course-learn__player']}>
                <video key={currentLecture.id} className={styles['course-learn__video']} controls autoPlay>
                  <source src={currentLecture.videoUrl} type="video/mp4" />
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
              </div>
            ) : (
              <div className={styles['course-learn__pdf-preview']}>
                <FileText className={styles['course-learn__pdf-preview__icon']} />
                <h3 className={styles['course-learn__pdf-preview__title']}>{currentLecture.title}</h3>
                <p className={styles['course-learn__pdf-preview__desc']}>{currentLecture.description}</p>
                <a href={currentLecture.pdfUrl} download>
                  <button className={styles['course-learn__brand-btn']}>
                    <Download className={styles['course-learn__icon']} />
                    PDF 다운로드
                  </button>
                </a>
              </div>
            )}
          </div>

          {/* 현재 강의 정보 */}
          <div className={styles['course-learn__info-card']}>
            <div className={styles['course-learn__info-row']}>
              {currentLecture.type === "video" ? <Play className={styles['course-learn__icon']} /> : <FileText className={styles['course-learn__icon']} />}
              <span className={styles['course-learn__progress']}>
                {currentLecture.type === "video" ? "영상 강의" : "PDF 자료"}
                {currentLecture.duration && ` · ${currentLecture.duration}`}
              </span>
            </div>
            <h2 className={styles['course-learn__info-title']}>{currentLecture.title}</h2>
            <p className={styles['course-learn__pdf-preview__desc']}>{currentLecture.description}</p>
          </div>
        </main>

        {/* 사이드바 - 커리큘럼 */}
        <aside className={styles['course-learn__aside']}>
          <div className={styles['course-learn__curriculum']}>
            <h3 className={styles['course-learn__curriculum__title']}>커리큘럼</h3>
            <p className={styles['course-learn__curriculum__meta']}>{getTotalLectures()}개 강의 · {getCompletedLectures()}개 완료</p>
          </div>
          <div className={styles['course-learn__curriculum__list']}>
            {courseData.sections.map((section) => (
              <div key={section.id}>
                <button onClick={() => toggleSection(section.id)} className={styles['course-learn__section-btn']}>
                  <div className={styles['course-learn__section-info']}>
                    <h4 className={styles['course-learn__section-title']}>{section.title}</h4>
                    <p className={styles['course-learn__section-meta']}>{section.lectures.length}개 강의</p>
                  </div>
                  {openSections.includes(section.id) ? <ChevronDown className={styles['course-learn__icon']} /> : <ChevronRight className={styles['course-learn__icon']} />}
                </button>
                {openSections.includes(section.id) && (
                  <div className={styles['course-learn__section-content']}>
                    {section.lectures.map((lecture) => (
                      <button key={lecture.id} onClick={() => handleLectureClick(lecture)} className={`${styles['course-learn__lecture-btn']} ${currentLecture.id === lecture.id ? styles['course-learn__lecture-btn--active'] : ""}`}>
                        <div className={styles['course-learn__lecture-icon']}>
                          {lecture.completed ? <CheckCircle className={styles['course-learn__icon']} /> : lecture.type === "video" ? <Play className={styles['course-learn__icon']} /> : <FileText className={styles['course-learn__icon']} />}
                        </div>
                        <div className={styles['course-learn__lecture-text']}>
                          <p className={styles['course-learn__lecture-title']}>{lecture.title}</p>
                          <p className={styles['course-learn__lecture-meta']}>{lecture.type === "video" ? lecture.duration : "PDF"}</p>
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
