import { jsx, jsxs } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { Shuffle, Sparkles, Camera, Shirt, Grid3x3 } from 'lucide-react';
import { c as useOutfits, u as useItems } from './useData-Ya3GAmCM.mjs';
import { O as OutfitThumbnail } from './OutfitThumbnail-MS8FGvSj.mjs';
import { u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';
import 'react';

function DashboardPage() {
  const {
    activeProfile
  } = useProfile();
  const {
    data: outfits,
    isLoading: outfitsLoading
  } = useOutfits(activeProfile?.id);
  const {
    data: items,
    isLoading: itemsLoading
  } = useItems(activeProfile?.id);
  const recentOutfits = outfits?.slice(0, 3) || [];
  const todaySuggestion = outfits?.[0];
  const hasOutfits = outfits && outfits.length > 0;
  const hasItems = items && items.length > 0;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto px-4 py-6", children: [
    hasOutfits && todaySuggestion && /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm mb-6 border border-blue-100 dark:border-blue-900", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: "Today's Outfit Suggestion" }),
      /* @__PURE__ */ jsx(OutfitThumbnail, { itemIds: todaySuggestion.itemIds, items, size: "large", className: "mb-4", loading: itemsLoading }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(Link, { to: "/outfits/$outfitId", params: {
          outfitId: todaySuggestion.id
        }, className: "flex-1 py-3 px-4 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-center", children: "View Details" }),
        /* @__PURE__ */ jsxs(Link, { to: "/outfits", className: "flex-1 py-3 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Shuffle, { className: "w-4 h-4" }),
          "Shuffle"
        ] })
      ] })
    ] }),
    !hasItems && !itemsLoading && /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-8 mb-6 border border-blue-200 dark:border-blue-800", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mb-2", children: "Welcome to Aura!" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "Your wardrobe is empty. Start by adding your first clothing item to build your digital closet." }),
      /* @__PURE__ */ jsxs(Link, { to: "/items/new", className: "inline-flex items-center gap-2 py-3 px-6 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors", children: [
        /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5" }),
        "Add Your First Item"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-4", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100", children: "Quick Actions" }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/items/new", className: "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Camera, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 text-center", children: "Add New Item" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/outfits/new", className: "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Shirt, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 text-center", children: "Create New Outfit" })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/wardrobe", className: "bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Grid3x3, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 text-center", children: "Wardrobe Overview" })
        ] })
      ] })
    ] }),
    hasOutfits && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100", children: "Recent Outfits" }),
        /* @__PURE__ */ jsx(Link, { to: "/outfits", className: "text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-500", children: "View All" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: recentOutfits.map((outfit) => /* @__PURE__ */ jsxs(Link, { to: "/outfits/$outfitId", params: {
        outfitId: outfit.id
      }, className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors", children: [
        /* @__PURE__ */ jsx(OutfitThumbnail, { itemIds: outfit.itemIds, items, size: "small", className: "mb-3", loading: itemsLoading }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 text-center truncate", children: outfit.name }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 text-center truncate", children: outfit.season })
      ] }, outfit.id)) })
    ] }),
    hasItems && !hasOutfits && !outfitsLoading && /* @__PURE__ */ jsx("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx(Shirt, { className: "w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2", children: "No Outfits Yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4 text-sm", children: "You have items in your wardrobe. Start creating outfits to mix and match your style!" }),
      /* @__PURE__ */ jsxs(Link, { to: "/outfits/new", className: "inline-flex items-center gap-2 py-2 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors text-sm", children: [
        /* @__PURE__ */ jsx(Shirt, { className: "w-4 h-4" }),
        "Create First Outfit"
      ] })
    ] }) })
  ] }) });
}

export { DashboardPage as component };
//# sourceMappingURL=index-nGD4nXRg.mjs.map
