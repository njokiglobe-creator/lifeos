import Sidebar from "./Sidebar";
import BottomTabBar from "./BottomTabBar";
import NotificationBanner from "./NotificationBanner";
import ThemeProvider from "./ThemeProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 pb-20 md:pb-0">
          <NotificationBanner />
          <div className="animate-in">{children}</div>
        </div>
        <BottomTabBar />
      </div>
    </ThemeProvider>
  );
}
