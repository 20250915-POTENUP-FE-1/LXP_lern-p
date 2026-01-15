type WithId = { id?: string | number | null };
type WithFlags = { _dirty?: boolean; _deleted?: boolean };
type WithTitle = { title?: string | null };

export function isValidTitle(title: unknown): boolean {
  return typeof title === 'string' && title.trim().length > 0;
}

export function hasServerId(entity: WithId): boolean {
  return entity.id !== undefined && entity.id !== null && String(entity.id).trim().length > 0;
}

export function isDirty(entity: WithFlags): boolean {
  return entity._dirty === true;
}

export function isDeleted(entity: WithFlags): boolean {
  return entity._deleted === true;
}

// lecture.resource[0].fileUrl은 실제 URL이 아니라 resourceKey(key)를 저장한다.
// 즉, lecture.resource[0].fileUrl === resourceKey 로 취급한다.
export function isValidLectureResource(lecture: any): boolean {
  const primary = lecture?.resource?.[0];
  const resourceType = primary?.resourceType;
  const resourceKey = primary?.fileUrl;

  return (
    typeof resourceType === 'string' &&
    resourceType.trim().length > 0 &&
    typeof resourceKey === 'string' &&
    resourceKey.trim().length > 0
  );
}

export function shouldCreateSection(section: any): boolean {
  return !hasServerId(section) && !isDeleted(section) && isValidTitle(section?.title);
}

export function shouldUpdateSection(section: any): boolean {
  return (
    hasServerId(section) && !isDeleted(section) && isDirty(section) && isValidTitle(section?.title)
  );
}

export function shouldDeleteSection(section: any): boolean {
  return hasServerId(section) && isDeleted(section);
}

export function shouldCreateLecture(section: any, lecture: any): boolean {
  return (
    hasServerId(section) &&
    !hasServerId(lecture) &&
    !isDeleted(lecture) &&
    isValidTitle(lecture?.title) &&
    isValidLectureResource(lecture)
  );
}

export function shouldUpdateLecture(section: any, lecture: any): boolean {
  return (
    hasServerId(section) &&
    hasServerId(lecture) &&
    !isDeleted(lecture) &&
    isDirty(lecture) &&
    isValidTitle(lecture?.title) &&
    isValidLectureResource(lecture)
  );
}

export function shouldDeleteLecture(lecture: any): boolean {
  return hasServerId(lecture) && isDeleted(lecture);
}

// Flush 대상 판별: _dirty === true 또는 (id 없음 && 필수값 충족)
export function isFlushTargetSection(section: any): boolean {
  return (
    isDirty(section) ||
    (!hasServerId(section) && isValidTitle(section?.title) && !isDeleted(section))
  );
}

export function isFlushTargetLecture(section: any, lecture: any): boolean {
  const hasRequired =
    isValidTitle(lecture?.title) && isValidLectureResource(lecture) && !isDeleted(lecture);
  return isDirty(lecture) || (!hasServerId(lecture) && hasServerId(section) && hasRequired);
}
