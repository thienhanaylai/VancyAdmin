import { Outlet } from "react-router";
import Navbar from "./layout/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
