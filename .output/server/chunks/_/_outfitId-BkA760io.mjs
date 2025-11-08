import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { ChevronLeft, Edit, MoreVertical, Trash2, Shirt } from 'lucide-react';
import { h as useOutfitWithItems, i as useDeleteOutfit } from './useData-Ya3GAmCM.mjs';
import { useState, useRef, useEffect } from 'react';
import { b as Route$5 } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';

function OutfitDetailPage() {
  const navigate = useNavigate();
  const {
    outfitId
  } = Route$5.useParams();
  const {
    data: outfit,
    isLoading,
    error
  } = useOutfitWithItems(outfitId);
  const deleteOutfit = useDeleteOutfit();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this outfit? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteOutfit.mutateAsync(outfitId);
      navigate({
        to: "/outfits"
      });
    } catch (err) {
      console.error("Failed to delete outfit:", err);
      alert("Failed to delete outfit");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading outfit..." })
    ] }) });
  }
  if (error || !outfit) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: "Outfit not found" }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate({
        to: "/outfits"
      }), className: "mt-4 text-blue-600 dark:text-blue-400 hover:underline", children: "Back to Outfits" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/outfits"
      }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        "Outfit Details"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => navigate({
          to: "/outfits/$outfitId/edit",
          params: {
            outfitId
          }
        }), className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors", title: "Edit", children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative", ref: moreMenuRef, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setShowMoreMenu(!showMoreMenu), className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors", title: "More options", children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
          showMoreMenu && /* @__PURE__ */ jsx("div", { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20", children: /* @__PURE__ */ jsxs("button", { onClick: () => {
            setShowMoreMenu(false);
            handleDelete();
          }, className: "w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
            "Delete Outfit"
          ] }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-6 border border-blue-200 dark:border-blue-800", children: outfit.items && outfit.items.length > 0 ? /* @__PURE__ */ jsx("div", { className: `grid gap-2 ${outfit.items.length === 1 ? "grid-cols-1" : outfit.items.length === 2 ? "grid-cols-2" : outfit.items.length === 3 ? "grid-cols-2" : "grid-cols-3"}`, children: outfit.items.slice(0, 9).map((item, index) => {
        const isFirstOfThree = outfit.items.length === 3 && index === 0;
        return /* @__PURE__ */ jsx("div", { className: `bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-blue-200 dark:border-blue-700 ${isFirstOfThree ? "col-span-2" : ""} ${outfit.items.length === 1 ? "h-80" : isFirstOfThree ? "h-56" : outfit.items.length === 2 ? "h-64" : "h-40"}`, children: /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700", children: item.hasPhoto && item.photo ? /* @__PURE__ */ jsx("img", { src: item.photo, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Shirt, { className: "w-12 h-12 text-gray-400 dark:text-gray-600" }) }) }, item.id);
      }) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 py-12", children: [
        /* @__PURE__ */ jsx(Shirt, { className: "w-20 h-20 text-blue-400 dark:text-blue-600" }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-600 dark:text-blue-400 font-medium", children: "No items in this outfit yet" })
      ] }) }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mb-4", children: outfit.name }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          outfit.occasion && /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Occasion:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: outfit.occasion })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Season:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: outfit.season })
          ] }),
          outfit.weather && /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Weather:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: outfit.weather })
          ] }),
          outfit.tags && /* @__PURE__ */ jsx("div", { className: "py-2", children: /* @__PURE__ */ jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [
            "Tags: ",
            outfit.tags
          ] }) })
        ] }),
        outfit.notes && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-800", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-600 dark:text-gray-400 mb-2", children: "Notes:" }),
          /* @__PURE__ */ jsx("div", { className: "min-h-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 text-sm", children: outfit.notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: [
          "Items in this Outfit (",
          outfit.items?.length || 0,
          ")"
        ] }),
        outfit.items && outfit.items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: outfit.items.map((item) => /* @__PURE__ */ jsxs(Link, { to: "/items/$itemId", params: {
          itemId: item.id
        }, className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg h-32 mb-3 flex items-center justify-center overflow-hidden", children: item.hasPhoto && item.photo ? /* @__PURE__ */ jsx("img", { src: item.photo, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Shirt, { className: "w-12 h-12 text-gray-400 dark:text-gray-600" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate", children: item.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 text-center truncate", children: item.category })
        ] }, item.id)) }) : /* @__PURE__ */ jsx("div", { className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No items in this outfit yet" }) })
      ] })
    ] })
  ] }) });
}

export { OutfitDetailPage as component };
//# sourceMappingURL=_outfitId-BkA760io.mjs.map
