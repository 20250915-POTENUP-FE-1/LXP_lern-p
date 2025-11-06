// /src/app/App.jsx
import React from "react";
import { RouterProvider } from "react-router";
import router from "@/router";
import "@/app/global.css";

export default function App() {
  return <RouterProvider router={router} />;
}
