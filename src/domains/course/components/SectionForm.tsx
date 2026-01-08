'use client';
import { useMemo, useState } from 'react';
import { useSectionForm } from '../hooks/useSectionForm';
import { ResourceType } from '../types/course';
import styles from './CourseForm.module.css';
import { ResourceUploader } from './ResourceUploader';

export function SectionForm() {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const {
    sections,
    step1Data,
    loading,
    submitting,
    error,
    success,
    isInvalid,
    handleSectionAdd,
    handleSectionDelete,
    handleLectureAdd,
    handleLectureDelete,
    handleSectionTitleChange,
    handleLectureTitleChange,
    handleLectureUpload,
    handleLectureRemoveResource,
    handleFinalSubmit,
    handlePrevStep,
    handleCancel,
  } = useSectionForm();

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const lectureCounts = useMemo(
    () =>
      sections.reduce<Record<string, number>>((acc, section) => {
        acc[section.localId] = section.lectures.filter((lecture) => !lecture._deleted).length;
        return acc;
      }, {}),
    [sections],
  );

  if (!step1Data) {
    return <p>강좌 기본 정보를 불러오는 중입니다. 잠시만 기다려주세요...</p>;
  }

  return (
    <form onSubmit={handleFinalSubmit}>
      <div className={styles['course-form__field']}>
        <label htmlFor="lecture" className={styles['form__label']}>
          섹션 <span className={styles['course-form__req']}>*</span>
        </label>

        <section className={styles['course-form']} aria-label="섹션 구성">
          {sections.map((section, sectionIdx) => (
            <div key={section.localId} className={styles['section']}>
              <header className={styles['section-list__header']}>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionTitleChange(section.localId, e.target.value)}
                  className={styles['course-form__input']}
                  placeholder={`섹션 ${sectionIdx + 1} 제목 입력`}
                />

                <div className={styles['section-list__actions']}>
                  <button
                    type="button"
                    className={styles['section-list__action']}
                    onClick={() => toggleSection(section.localId)}
                  >
                    {collapsedSections.has(section.localId) ? '섹션 펼치기' : '섹션 접기'} (
                    {lectureCounts[section.localId] ?? 0})
                  </button>
                  <button
                    type="button"
                    className={`${styles['section-list__action']} ${styles['section-list__action--danger']}`}
                    onClick={() => handleSectionDelete(section.localId)}
                  >
                    섹션 삭제
                  </button>
                </div>
              </header>

              {!collapsedSections.has(section.localId) && (
                <>
                  <ul className={styles['lecture-list']}>
                    {section.lectures
                      .filter((lecture) => !lecture._deleted) // 삭제된 강의 제외
                      .map((lecture) => (
                        <li key={lecture.localId} className={styles['lecture-list__item']}>
                          <div className={styles['lecture-list__edit-group']}>
                            <label htmlFor="lecture" className={styles['form__label']}>
                              강의 <span className={styles['course-form__req']}>*</span>
                            </label>
                            <div className={styles['lecture-list__title-row']}>
                              <input
                                type="text"
                                value={lecture.title}
                                onChange={(e) =>
                                  handleLectureTitleChange(
                                    section.localId,
                                    lecture.localId,
                                    e.target.value,
                                  )
                                }
                                className={styles['course-form__input']}
                                placeholder="강의 제목 입력"
                              />
                              <button
                                type="button"
                                className={`${styles['lecture-list__action']} ${styles['lecture-list__action--danger']}`}
                                onClick={() =>
                                  handleLectureDelete(section.localId, lecture.localId)
                                }
                              >
                                강의 삭제
                              </button>
                            </div>
                            <ResourceUploader
                              key={lecture.localId}
                              initialValue={
                                lecture.resource?.[0]
                                  ? {
                                      resourceType: lecture.resource[0]
                                        .resourceType as ResourceType,
                                      fileUrl:
                                        lecture.resource[0].resourceType === 'VIDEO'
                                          ? (lecture.videoUrl ?? lecture.resource[0].fileUrl ?? '')
                                          : (lecture.resource[0].fileUrl ?? ''),
                                      isDownloadable: !!lecture.resource[0].isDownloadable,
                                      duration: lecture.duration,
                                      fileName: undefined,
                                    }
                                  : undefined
                              }
                              onUploadComplete={(result) =>
                                handleLectureUpload(section.localId, lecture.localId, result)
                              }
                              onRemove={() =>
                                handleLectureRemoveResource(section.localId, lecture.localId)
                              }
                            />
                          </div>
                        </li>
                      ))}
                  </ul>

                  <button
                    type="button"
                    className={styles['section-list__action']}
                    onClick={() => handleLectureAdd(section.localId)}
                  >
                    + 강의 추가
                  </button>
                </>
              )}
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
          onClick={() => {
            sessionStorage.setItem('courseDraft_step2', JSON.stringify(sections));
            handlePrevStep();
          }}
          disabled={loading}
        >
          이전 단계
        </button>
        <button
          type="button"
          className={`${styles['btn']} ${styles['btn--ghost']}`}
          onClick={() => handleCancel()}
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
