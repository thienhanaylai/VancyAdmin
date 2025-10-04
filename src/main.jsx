import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import AppRoutes from "./routes/AppRoutes";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={AppRoutes} />
);
