import { jsxs, jsx } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Sparkles, Bell, Lock, Database, Info, ChevronRight, Palette, Check, RotateCcw } from 'lucide-react';
import { a as useTheme, u as useProfile } from './router-h1SIfdX4.mjs';
import { e as useResetProfile } from './useData-Ya3GAmCM.mjs';
import { useState } from 'react';
import '@tanstack/react-query';

function SettingsPage() {
  const navigate = useNavigate();
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    activeProfile
  } = useProfile();
  const resetProfile = useResetProfile();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleResetProfile = async () => {
    if (!activeProfile) return;
    try {
      await resetProfile.mutateAsync(activeProfile.id);
      setShowConfirmDialog(false);
      alert("Profile reset successfully! All items, outfits, and calendar entries have been removed.");
    } catch (error) {
      console.error("Failed to reset profile:", error);
      alert("Failed to reset profile. Please try again.");
    }
  };
  const settingsSections = [{
    title: "Preferences",
    items: [{
      icon: Sparkles,
      label: "AI Settings",
      description: "Configure TryOff AI and tokens",
      route: "/settings/ai"
    }, {
      icon: Bell,
      label: "Notifications",
      description: "Manage notification settings",
      route: "/settings/notifications"
    }]
  }, {
    title: "Privacy & Security",
    items: [{
      icon: Lock,
      label: "Privacy",
      description: "Control your privacy settings",
      route: "/settings/privacy"
    }, {
      icon: Database,
      label: "Data Management",
      description: "Manage your data",
      route: "/settings/data"
    }]
  }, {
    title: "About",
    items: [{
      icon: Info,
      label: "About Aura",
      description: "Version and information",
      route: "/settings/about"
    }]
  }];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/"
      }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        "Settings"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
        settingsSections.map((section, idx) => /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: section.title }),
          /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: section.items.map((item, itemIdx) => {
            const Icon = item.icon;
            return /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
              to: item.route
            }), className: `w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${itemIdx !== section.items.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`, children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: item.label }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: item.description })
              ] }),
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-gray-400 dark:text-gray-600" })
            ] }, itemIdx);
          }) })
        ] }, idx)),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Appearance" }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setTheme("light"), className: "w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-yellow-50 dark:bg-yellow-950 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Palette, { className: "w-5 h-5 text-yellow-600 dark:text-yellow-400" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Light Mode" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Use light theme" })
              ] }),
              theme === "light" && /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setTheme("dark"), className: "w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Palette, { className: "w-5 h-5 text-indigo-600 dark:text-indigo-400" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Dark Mode" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Use dark theme" })
              ] }),
              theme === "dark" && /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setTheme("system"), className: "w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Palette, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 text-left", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "System" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Follow system theme" })
              ] }),
              theme === "system" && /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => setShowConfirmDialog(true), disabled: !activeProfile, className: "w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900 transition-colors border border-red-200 dark:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed", children: [
          /* @__PURE__ */ jsx(RotateCcw, { className: "w-5 h-5" }),
          "Reset Current Profile"
        ] })
      ] })
    ] }),
    showConfirmDialog && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(RotateCcw, { className: "w-6 h-6 text-red-600 dark:text-red-400" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Reset Profile?" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: [
            "This will permanently delete all data associated with ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: activeProfile?.name }),
            ":"
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1 ml-2", children: [
            /* @__PURE__ */ jsx("li", { children: "All clothing items" }),
            /* @__PURE__ */ jsx("li", { children: "All saved outfits" }),
            /* @__PURE__ */ jsx("li", { children: "All calendar entries" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 dark:text-red-400 font-medium mt-3", children: "This action cannot be undone!" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowConfirmDialog(false), className: "flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: handleResetProfile, disabled: resetProfile.isPending, className: "flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: resetProfile.isPending ? "Resetting..." : "Reset Profile" })
      ] })
    ] }) })
  ] });
}

export { SettingsPage as component };
//# sourceMappingURL=index-bPbinRAv.mjs.map
