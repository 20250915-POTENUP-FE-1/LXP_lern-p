import React from "react";
import { createBrowserRouter } from "react-router";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import CourseListPage from "@/domains/course/pages/CourseListPage";
import CourseDetailPage from "@/domains/course/pages/CourseDetailPage";
import CourseCreatePage from "@/domains/course/pages/CourseCreatePage";
import SignupPage from "@/domains/auth/pages/SignupPage";
import MyPage from "@/domains/user/pages/MyPage";
import InstructorCourses from "@/domains/user/pages/instructor/InstructorCourses";
import Profile from "@/domains/user/pages/Profile";
import Enrolled from "@/domains/user/pages/Enrolled";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <CourseListPage /> },
      { path: "courses/:id", element: <CourseDetailPage /> },
      { path: "courses/create", element: <CourseCreatePage /> },

      {
        path: "mypage",
        element: <MyPage />,
        children: [
          { index: true, element: <Profile /> }, // /mypage
          { path: "enrolled", element: <Enrolled /> }, // /mypage/enrolled
          { path: "instructor/courses", element: <InstructorCourses /> },
          // { path: "instructor/create", element: <InstructorCreate /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [{ path: "signup", element: <SignupPage /> }],
  },
]);

export default router;
