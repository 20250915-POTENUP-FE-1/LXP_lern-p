'use client';
import { useRouter } from 'next/navigation';

import styles from './CourseForm.module.css';
import { LectureUploader } from './LectureUploader';
import { useSectionForm } from '../hooks/useSectionForm';

export function SectionForm() {
  const router = useRouter();

  const {
    sections,
    step1Data,
    loading,
    submitting,
    drafting,
    error,
    success,
    isInvalid,
    handleDraftSave,
    handleSectionAdd,
    handleSectionDelete,
    handleLectureAdd,
    handleLectureDelete,
    handleSectionTitleChange,
    handleLectureTitleChange,
    handleLectureUpload,
    handleFinalSubmit,
    handlePrevStep,
  } = useSectionForm();

  if (!step1Data) {
    return <p>강좌 기본 정보를 불러오는 중입니다. 잠시만 기다려주세요...</p>;
  }

  return (
    <form onSubmit={handleFinalSubmit}>
      <h1>강좌 섹션 및 강의 </h1>

      <div className={styles['course-form__field']}>
        <label htmlFor="lecture" className={styles['form__label']}>
          섹션 <span className={styles['course-form__req']}>*</span>
        </label>

        <section className={styles['course-form']} aria-label="섹션 구성">
          {sections.map((section, sectionIdx) => (
            <div key={section.id} className={styles['section']}>
              <header className={styles['section-list__header']}>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                  className={styles['course-form__input']}
                  placeholder={`섹션 ${sectionIdx + 1} 제목 입력`}
                />

                <div className={styles['section-list__actions']}>
                  <button
                    type="button"
                    className={styles['section-list__action']}
                    onClick={() => handleSectionDelete(section.id)}
                  >
                    섹션 삭제
                  </button>
                </div>
              </header>

              <ul className={styles['lecture-list']}>
                {section.lectures.map((lecture) => (
                  <li key={lecture.id} className={styles['lecture-list__item']}>
                    <div className={styles['lecture-list__edit-group']}>
                      <input
                        type="text"
                        value={lecture.title}
                        onChange={(e) =>
                          handleLectureTitleChange(section.id, lecture.id, e.target.value)
                        }
                        className={styles['course-form__input']}
                        placeholder="강의 제목 입력"
                      />
                    </div>

                    <LectureUploader
                      onUploadComplete={({ videoUrl, duration }) =>
                        handleLectureUpload(section.id, lecture.id, { videoUrl, duration })
                      }
                    />

                    <button
                      type="button"
                      className={`${styles['lecture-list__action']} ${styles['lecture-list__action--danger']}`}
                      onClick={() => handleLectureDelete(section.id, lecture.id)}
                    >
                      강의 삭제
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={styles['section-list__action']}
                onClick={() => handleLectureAdd(section.id)}
              >
                + 강의 추가
              </button>
            </div>
          ))}

          <button
            type="button"
            className={styles['section-list__action']}
            onClick={handleSectionAdd}
          >
            + 새 섹션 추가
          </button>
        </section>
      </div>

      {/* 저장/취소 */}

      <div className={styles['form-actions']}>
        <button
          type="button"
          className={`${styles['btn']} ${styles['btn--ghost']}`}
          onClick={handlePrevStep}
          disabled={loading}
        >
          이전 단계
        </button>
        <button
          type="button"
          onClick={handleDraftSave} // 새로 만든 핸들러 연결
          disabled={loading || drafting}
          className={`${styles['btn']} ${styles['btn--ghost']}`}
        >
          {drafting ? '임시 저장 중...' : '임시 저장'}
        </button>
        <button
          type="button"
          className={`${styles['btn']} ${styles['btn--ghost']}`}
          onClick={() => router.back()}
          disabled={loading}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading || submitting || isInvalid}
          className={`${styles['btn']} ${styles['btn--primary']}`}
        >
          {submitting ? '등록 중...' : '등록하기'}
        </button>
      </div>
      {success && <p style={{ color: 'green' }}>강좌가 성공적으로 등록되었습니다!</p>}
      {error && <p style={{ color: 'red' }}>오류: {error}</p>}
    </form>
  );
}
