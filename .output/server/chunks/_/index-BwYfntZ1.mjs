import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { ChevronLeft, Plus, Shirt } from 'lucide-react';
import { c as useOutfits, u as useItems } from './useData-Ya3GAmCM.mjs';
import { O as OutfitThumbnail } from './OutfitThumbnail-MS8FGvSj.mjs';
import { u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';
import 'react';

function OutfitsPage() {
  const navigate = useNavigate();
  const {
    activeProfile
  } = useProfile();
  const {
    data: outfits,
    isLoading,
    error
  } = useOutfits(activeProfile?.id);
  const {
    data: items,
    isLoading: itemsLoading
  } = useItems(activeProfile?.id);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading outfits..." })
    ] }) });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: "Failed to load outfits" }) }) });
  }
  const hasOutfits = outfits && outfits.length > 0;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/"
      }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        "My Outfits"
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/outfits/new", className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors", children: /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5 text-blue-600 dark:text-blue-400" }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-6", children: hasOutfits ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: outfits.map((outfit) => /* @__PURE__ */ jsxs(Link, { to: "/outfits/$outfitId", params: {
      outfitId: outfit.id
    }, className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors", children: [
      /* @__PURE__ */ jsx(OutfitThumbnail, { itemIds: outfit.itemIds, items, size: "medium", className: "mb-3", loading: itemsLoading }),
      /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 dark:text-gray-100 mb-1", children: outfit.name }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: outfit.season })
    ] }, outfit.id)) }) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-sm", children: [
      /* @__PURE__ */ jsx(Shirt, { className: "w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-6" }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3", children: "No Outfits Yet" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: "Start creating outfits by combining your wardrobe items into stylish looks." }),
      /* @__PURE__ */ jsxs(Link, { to: "/outfits/new", className: "inline-flex items-center gap-2 py-3 px-6 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        "Create Your First Outfit"
      ] })
    ] }) }) })
  ] }) });
}

export { OutfitsPage as component };
//# sourceMappingURL=index-BwYfntZ1.mjs.map
