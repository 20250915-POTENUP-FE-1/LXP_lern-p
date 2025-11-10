import SignUpPage from '@/domains/auth/pages/SignUpPage';
import CourseCreatePage from '@/domains/course/pages/CourseCreatePage';
import CourseDetailPage from '@/domains/course/pages/CourseDetailPage';
import CourseListPage from '@/domains/course/pages/CourseListPage';
import Cart from '@/domains/user/pages/Cart';
import Enrolled from '@/domains/user/pages/Enrolled';
import InstructorCourses from '@/domains/user/pages/instructor/InstructorCourses';
import MyPage from '@/domains/user/pages/MyPage';
import Profile from '@/domains/user/pages/Profile';
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { createBrowserRouter } from 'react-router';
import { RequireAuth } from './guards/RequireAuth';
import { RequireInstructor } from './guards/RequireInstructor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <CourseListPage /> },
      { path: 'courses/:id', element: <CourseDetailPage /> },
      {
        path: 'courses/create',
        element: (
          <RequireInstructor>
            <CourseCreatePage />
          </RequireInstructor>
        ),
      },
      {
        path: 'mypage',
        element: (
          <RequireAuth>
            <MyPage />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Profile /> }, // /mypage
          { path: 'enrolled', element: <Enrolled /> }, // /mypage/enrolled
          { path: 'cart', element: <Cart /> },
          {
            path: 'instructor/courses',
            element: (
              <RequireInstructor>
                <InstructorCourses />{' '}
              </RequireInstructor>
            ),
          },
          // { path: "instructor/create", element: <InstructorCreate /> },
        ],
      },
    ],
  },
  {
    path: '/signup',
    element: <AuthLayout />,
    children: [{ index: true, element: <SignUpPage /> }],
  },
]);

export default router;
