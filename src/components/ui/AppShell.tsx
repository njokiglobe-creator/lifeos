import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";
import NotificationBanner from "./NotificationBanner";
import ThemeProvider from "./ThemeProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative flex min-h-screen overflow-hidden">
        <div className="ambient-glow absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-dawn-gradient opacity-[0.05] blur-3xl pointer-events-none" />
        <Sidebar />
        <div className="relative flex-1 pb-20 md:pb-0">
          <NotificationBanner />
          <div className="animate-in">{children}</div>
        </div>
        <BottomTabBar />
      </div>
    </ThemeProvider>
  );
}
