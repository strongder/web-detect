import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen items-center  bg-[#0c1220]">
      <div className="w-[80%] max-w-screen-xl bg-[#1c2437] rounded-2xl shadow-xl p-6">
        <Header />
        <Navigation />
        <main className="mt-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
