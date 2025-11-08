import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { ChevronLeft, Plus } from 'lucide-react';
import { u as useItems } from './useData-Ya3GAmCM.mjs';
import { u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';
import 'react';

function WardrobePage() {
  const navigate = useNavigate();
  const {
    activeProfile
  } = useProfile();
  const {
    data: items,
    isLoading,
    error
  } = useItems(activeProfile?.id);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading items..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-md px-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400 mb-4", children: "Failed to load items" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: error instanceof Error ? error.message : "Unknown error" }),
      /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors", children: "Reload Page" })
    ] }) });
  }
  const hasItems = items && items.length > 0;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/"
    }), className: "flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "My Wardrobe"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-6", children: hasItems ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3", children: items.map((item) => /* @__PURE__ */ jsxs(Link, { to: "/items/$itemId", params: {
      itemId: item.id
    }, className: "bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center overflow-hidden", children: item.photo ? /* @__PURE__ */ jsx("img", { src: item.photo, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-400 dark:text-blue-600 font-medium text-center px-1", children: "No Photo" }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 truncate", children: item.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 truncate", children: item.category })
      ] })
    ] }, item.id)) }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(Plus, { className: "w-12 h-12 text-gray-300 dark:text-gray-600" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3", children: "Your Wardrobe is Empty" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "Start building your digital closet by adding your first clothing item." }),
      /* @__PURE__ */ jsxs(Link, { to: "/items/new", className: "inline-flex items-center gap-2 py-3 px-6 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        "Add Your First Item"
      ] })
    ] }) }) })
  ] }) });
}

export { WardrobePage as component };
//# sourceMappingURL=wardrobe-D6XD9N7F.mjs.map
