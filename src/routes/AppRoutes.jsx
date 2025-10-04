import { createBrowserRouter } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import UserManage from "../pages/UserManage";
import ProductManage from "../pages/ProductManage";
import NewsManage from "../pages/NewsManage";

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "user",
        element: <UserManage />,
      },
      {
        path: "product",
        element: <ProductManage />,
      },
      {
        path: "news",
        element: <NewsManage />,
      },
    ],
  },
]);
export default AppRoutes;
