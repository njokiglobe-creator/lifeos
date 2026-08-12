"use client";

import { LogOut, Check, Bell } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { useSettings } from "@/src/hooks/useSettings";
import { usePushSubscription } from "@/src/hooks/usePushSubscription";
import { THEMES } from "@/src/lib/themes";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import InstallButton from "@/src/components/ui/InstallButton";

export default function SettingsPage() {
  const { user } = useAuth();
  const { prefs, setThemeId } = useSettings();
  const { permission, subscribed, subscribe } = usePushSubscription();

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <h1 className="font-display italic text-3xl mb-8">Settings</h1>

        <section className="mb-8">
          <p className="text-xs text-muted uppercase tracking-wide mb-3">Account</p>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-surface-raised flex items-center justify-center text-lg">
                {user?.displayName?.[0] ?? "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => signOut(auth)}
              className="flex items-center gap-1.5 text-sm text-accent-danger hover:opacity-80 transition shrink-0"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </section>

        <section className="mb-8">
          <p className="text-xs text-muted uppercase tracking-wide mb-3">Notifications</p>
          <div className="p-4 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-3 mb-3">
              <Bell size={18} className="text-accent-dawn" />
              <p className="text-sm text-muted flex-1">
                Get notified for each scheduled block — even when the app is closed.
              </p>
            </div>
            {subscribed ? (
              <p className="text-sm text-accent-success">✓ Notifications enabled</p>
            ) : permission === "denied" ? (
              <p className="text-sm text-accent-danger">
                Notifications are blocked in your browser settings. Enable them for this site to receive reminders.
              </p>
            ) : (
              <button
                onClick={subscribe}
                className="bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Enable Notifications
              </button>
            )}
          </div>
        </section>

        <section className="mb-8">
          <p className="text-xs text-muted uppercase tracking-wide mb-3">App</p>
          <div className="p-4 rounded-xl border border-border bg-surface">
            <p className="text-sm text-muted mb-3">Install LifeOS on this device for quick access.</p>
            <InstallButton />
          </div>
        </section>

        <section className="mb-8">
          <p className="text-xs text-muted uppercase tracking-wide mb-3">Appearance</p>
          <div className="p-4 rounded-xl border border-border bg-surface">
            <p className="text-sm text-muted mb-4">Choose your accent color</p>
            <div className="grid grid-cols-5 gap-3">
              {THEMES.map((theme) => {
                const selected = prefs.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setThemeId(theme.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition ${
                        selected ? "ring-2 ring-offset-2 ring-offset-surface ring-white/60" : ""
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${theme.dawn}, ${theme.gold}, ${theme.dusk})`,
                      }}
                    >
                      {selected && <Check size={16} className="text-black/70" />}
                    </div>
                    <span className="text-[11px] text-muted">{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs text-muted uppercase tracking-wide mb-3">About</p>
          <div className="p-4 rounded-xl border border-border bg-surface text-sm text-muted">
            LifeOS — your personal operating system for discipline and consistency.
          </div>
        </section>
      </div>
    </ProtectedShell>
  );
}
