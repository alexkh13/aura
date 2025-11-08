import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Shirt, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { u as useItems, h as useOutfitWithItems, n as useUpdateOutfit } from './useData-Ya3GAmCM.mjs';
import { f as Route, u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';

function EditOutfitPage() {
  const navigate = useNavigate();
  const {
    outfitId_
  } = Route.useParams();
  const outfitId = outfitId_;
  const {
    activeProfile
  } = useProfile();
  const {
    data: items
  } = useItems(activeProfile?.id);
  const {
    data: outfit,
    isLoading
  } = useOutfitWithItems(outfitId);
  const updateOutfit = useUpdateOutfit();
  const [formData, setFormData] = useState({
    name: "",
    season: "",
    occasion: "",
    weather: "",
    tags: "",
    notes: ""
  });
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  useEffect(() => {
    if (outfit) {
      setFormData({
        name: outfit.name || "",
        season: outfit.season || "",
        occasion: outfit.occasion || "",
        weather: outfit.weather || "",
        tags: outfit.tags || "",
        notes: outfit.notes || ""
      });
      setSelectedItemIds(outfit.itemIds || []);
    }
  }, [outfit]);
  const toggleItem = (itemId) => {
    setSelectedItemIds((prev) => prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]);
  };
  const selectedItems = items?.filter((item) => selectedItemIds.includes(item.id)) || [];
  const handleSave = async () => {
    if (!formData.name || !formData.season) {
      alert("Please fill in the required fields: Name and Season");
      return;
    }
    if (selectedItemIds.length === 0) {
      alert("Please select at least one item for the outfit");
      return;
    }
    try {
      await updateOutfit.mutateAsync({
        id: outfitId,
        data: {
          name: formData.name,
          season: formData.season,
          itemIds: selectedItemIds,
          occasion: formData.occasion || void 0,
          weather: formData.weather || void 0,
          tags: formData.tags || void 0,
          notes: formData.notes || void 0
        }
      });
      navigate({
        to: "/outfits/$outfitId",
        params: {
          outfitId
        }
      });
    } catch (error) {
      console.error("Failed to update outfit:", error);
      alert("Failed to save outfit. Please try again.");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading outfit..." })
    ] }) });
  }
  if (!outfit) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: "Outfit not found" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
        to: "/outfits"
      }), className: "mt-4 text-blue-600 dark:text-blue-400 hover:underline", children: "Back to Outfits" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => navigate({
        to: "/outfits/$outfitId",
        params: {
          outfitId
        }
      }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        "Edit Outfit"
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: handleSave, disabled: updateOutfit.isPending, className: "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: updateOutfit.isPending ? "Saving..." : "Save" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: "Outfit Details" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [
              "Outfit Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Casual Weekend Look", value: formData.name, onChange: (e) => setFormData({
              ...formData,
              name: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: [
              "Season ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Spring/Summer, Fall, Winter, All Season", value: formData.season, onChange: (e) => setFormData({
              ...formData,
              season: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Occasion" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Casual, Formal, Date Night", value: formData.occasion, onChange: (e) => setFormData({
              ...formData,
              occasion: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Weather" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Sunny, Rainy, Cold", value: formData.weather, onChange: (e) => setFormData({
              ...formData,
              weather: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Tags" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., #casual #comfortable", value: formData.tags, onChange: (e) => setFormData({
              ...formData,
              tags: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Notes" }),
            /* @__PURE__ */ jsx("textarea", { rows: 3, placeholder: "Add notes...", value: formData.notes, onChange: (e) => setFormData({
              ...formData,
              notes: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: [
          "Select Items (",
          selectedItemIds.length,
          " selected)"
        ] }),
        items && items.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 mb-6", children: items.map((item) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => toggleItem(item.id), className: `flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${selectedItemIds.includes(item.id) ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center overflow-hidden", children: item.hasPhoto && item.photo ? /* @__PURE__ */ jsx("img", { src: item.photo, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Shirt, { className: "w-6 h-6 text-blue-400 dark:text-blue-600" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full", children: item.name })
        ] }, item.id)) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 mb-4", children: "No items found in your wardrobe" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
            to: "/items/new"
          }), className: "text-blue-600 dark:text-blue-400 hover:underline", children: "Add your first item" })
        ] }),
        selectedItems.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3", children: "Selected Items" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: selectedItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden", children: item.hasPhoto && item.photo ? /* @__PURE__ */ jsx("img", { src: item.photo, alt: item.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Shirt, { className: "w-6 h-6 text-blue-400 dark:text-blue-600" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-800 dark:text-gray-100 text-sm", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 dark:text-gray-400", children: item.category })
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggleItem(item.id), className: "p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" }) })
          ] }, item.id)) })
        ] })
      ] })
    ] })
  ] }) });
}

export { EditOutfitPage as component };
//# sourceMappingURL=_outfitId_.edit-B4qvcwv9.mjs.map
