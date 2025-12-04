export type User = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  cart: string[];
  enrolledCourses: string[];
  createdCourses: string[];
  avatarUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};