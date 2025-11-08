import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

function NotificationsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    dailyOutfitReminder: false,
    reminderTime: "08:00",
    weatherAlerts: false,
    wardrobeUpdates: true
  });
  useEffect(() => {
    const saved = localStorage.getItem("notificationSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load notification settings:", error);
      }
    }
  }, []);
  const updateSetting = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    localStorage.setItem("notificationSettings", JSON.stringify(newSettings));
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/settings"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "Notifications"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Reminders" }),
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-100 dark:border-gray-800", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Daily Outfit Reminder" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Get reminded to plan your outfit" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("dailyOutfitReminder", !settings.dailyOutfitReminder), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.dailyOutfitReminder ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.dailyOutfitReminder ? "translate-x-6" : "translate-x-1"}` }) })
          ] }),
          settings.dailyOutfitReminder && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm text-gray-600 dark:text-gray-400 mb-2", children: "Reminder Time" }),
            /* @__PURE__ */ jsx("input", { type: "time", value: settings.reminderTime, onChange: (e) => updateSetting("reminderTime", e.target.value), className: "w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Updates" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-gray-100 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Weather Alerts" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Get notified about weather changes" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("weatherAlerts", !settings.weatherAlerts), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.weatherAlerts ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.weatherAlerts ? "translate-x-6" : "translate-x-1"}` }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Wardrobe Updates" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Get notified when items need attention" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => updateSetting("wardrobeUpdates", !settings.wardrobeUpdates), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.wardrobeUpdates ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`, children: /* @__PURE__ */ jsx("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.wardrobeUpdates ? "translate-x-6" : "translate-x-1"}` }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-blue-800 dark:text-blue-200", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Note:" }),
        " Browser notifications require permission. Make sure to enable notifications in your browser settings for the best experience."
      ] }) })
    ] })
  ] }) });
}

export { NotificationsPage as component };
//# sourceMappingURL=notifications-B_cqHQk0.mjs.map
