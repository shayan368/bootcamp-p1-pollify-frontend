import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import RightRail from "./RightRail";
import MobileBottomNav from "./MobileBottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-black">
      <Topbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 md:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1 py-6 pb-24 md:pb-6">
          <Outlet />
        </main>
        <RightRail />
      </div>
      <MobileBottomNav />
    </div>
  );
}
