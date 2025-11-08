import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Bell } from 'lucide-react';

function NotificationsPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "Notifications"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-12", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Bell, { className: "w-12 h-12 text-gray-300 dark:text-gray-600" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3", children: "No Notifications" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "You're all caught up! We'll notify you when there's something new." })
    ] }) }) })
  ] }) });
}

export { NotificationsPage as component };
//# sourceMappingURL=notifications-CTRCJ02L.mjs.map
