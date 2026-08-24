import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
  return (
    <>
      <Nav />
      <main className="page-content">
        <Outlet />
      </main>
    </>
  );
}