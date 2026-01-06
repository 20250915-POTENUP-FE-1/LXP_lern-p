import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export function useCourseCreateEntry() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startCreateCourse = () => {
    if (pathname.startsWith('/courses/create')) return;

    const entry = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    router.push(`/courses/create?step=1&entry=${encodeURIComponent(entry)}`);
  };

  return { startCreateCourse };
}
