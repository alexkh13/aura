import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Heart, Star, Code, Github, Mail } from 'lucide-react';

function AboutPage() {
  const navigate = useNavigate();
  const appVersion = "1.0.0";
  const buildDate = "2025";
  const features = ["Digital wardrobe management", "Outfit planning and creation", "Calendar integration", "Multiple profile support", "Dark/Light theme", "Local-first data storage", "Import/Export functionality"];
  const technologies = [{
    name: "React 19",
    version: "^19.2.0"
  }, {
    name: "TanStack Router",
    version: "^1.132.0"
  }, {
    name: "RxDB",
    version: "^16.20.0"
  }, {
    name: "Tailwind CSS",
    version: "^4.0.6"
  }, {
    name: "Vite",
    version: "^7.1.7"
  }];
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/settings"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "About"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx("span", { className: "text-3xl text-white font-bold", children: "A" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "Aura Wardrobe" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 dark:text-gray-400 mb-1", children: [
          "Version ",
          appVersion
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-500", children: [
          "Built with ",
          Heart.name && /* @__PURE__ */ jsx(Heart, { className: "inline w-4 h-4 text-red-500 fill-red-500" }),
          " in ",
          buildDate
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: "Aura is a modern digital wardrobe management app that helps you organize your clothing, plan outfits, and track what you wear. All your data stays on your device with local-first storage." }) }) }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Features" }),
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: features.map((feature, index) => /* @__PURE__ */ jsxs("div", { className: `px-4 py-3 flex items-center gap-3 ${index !== features.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`, children: [
          /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300", children: feature })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Built With" }),
        /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: technologies.map((tech, index) => /* @__PURE__ */ jsxs("div", { className: `px-4 py-3 flex items-center justify-between ${index !== technologies.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Code, { className: "w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-700 dark:text-gray-300 font-medium", children: tech.name })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: tech.version })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2", children: "Links" }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden", children: [
          /* @__PURE__ */ jsxs("a", { href: "https://github.com", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Github, { className: "w-5 h-5 text-gray-700 dark:text-gray-300" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "GitHub Repository" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "View source code" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: "mailto:support@example.com", className: "flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Contact Support" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Get help and support" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
          "\xA9 ",
          buildDate,
          " Aura Wardrobe. All rights reserved."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 mt-1", children: "Made with care for your wardrobe" })
      ] }) })
    ] })
  ] }) });
}

export { AboutPage as component };
//# sourceMappingURL=about-o2CEhk-d.mjs.map
