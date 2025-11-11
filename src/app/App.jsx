// /src/app/App.jsx
import '@/app/global.css';
import router from '@/router';
import { RouterProvider } from 'react-router';

export default function App() {
  return <RouterProvider router={router} />;
}
