"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role ?? "user";
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Controlled notification toggles
  const [notifications, setNotifications] = useState({
    transactionAlerts: true,
    securityAlerts: true,
    marketingUpdates: false,
    weeklySummary: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account preferences and security settings</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">
                    {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="settings-name" className="mb-2 block text-sm font-medium text-muted-foreground">Full Name</label>
                    <Input id="settings-name" defaultValue={session?.user?.name ?? ""} />
                  </div>
                  <div>
                    <label htmlFor="settings-email" className="mb-2 block text-sm font-medium text-muted-foreground">Email</label>
                    <Input id="settings-email" defaultValue={session?.user?.email ?? ""} disabled />
                  </div>
                  <div>
                    <label htmlFor="settings-role" className="mb-2 block text-sm font-medium text-muted-foreground">Role</label>
                    <Input id="settings-role" value={userRole.charAt(0).toUpperCase() + userRole.slice(1)} disabled />
                  </div>
                  <div>
                    <label htmlFor="settings-phone" className="mb-2 block text-sm font-medium text-muted-foreground">Phone</label>
                    <Input id="settings-phone" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/80">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
                
                {/* Password */}
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Password</h3>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info("Password change is coming soon")}>Change Password</Button>
                  </div>
                </div>

                {/* 2FA */}
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button onClick={() => toast.info("Two-factor authentication is coming soon")} className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800">Enable 2FA</Button>
                  </div>
                </div>

                {/* Sessions */}
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">Active Sessions</h3>
                      <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                    </div>
                    <Button variant="outline" onClick={() => toast.info("Session management is coming soon")}>View Sessions</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
                
                {([
                  { key: "transactionAlerts" as const, label: "Transaction Alerts", description: "Get notified for all transactions" },
                  { key: "securityAlerts" as const, label: "Security Alerts", description: "Receive alerts for suspicious activity" },
                  { key: "marketingUpdates" as const, label: "Marketing Updates", description: "News and product updates" },
                  { key: "weeklySummary" as const, label: "Weekly Summary", description: "Weekly account summary email" },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <h3 className="font-medium text-foreground">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notifications[item.key]}
                      aria-label={item.label}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        notifications[item.key] ? "bg-primary" : "bg-muted"
                      }`}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          notifications[item.key] ? "translate-x-[22px]" : "translate-x-[2px]"
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/80">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Display Preferences</h2>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pref-lang" className="mb-2 block text-sm font-medium text-muted-foreground">Language</label>
                    <select id="pref-lang" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pref-tz" className="mb-2 block text-sm font-medium text-muted-foreground">Timezone</label>
                    <select id="pref-tz" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground">
                      <option>Eastern Time (ET)</option>
                      <option>Pacific Time (PT)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pref-currency" className="mb-2 block text-sm font-medium text-muted-foreground">Currency Display</label>
                    <select id="pref-currency" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="pref-date" className="mb-2 block text-sm font-medium text-muted-foreground">Date Format</label>
                    <select id="pref-date" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/80">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
