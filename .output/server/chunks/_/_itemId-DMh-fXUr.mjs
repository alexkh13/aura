import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { ChevronLeft, X, Check, Edit, MoreVertical, Trash2, Shirt } from 'lucide-react';
import { m as useItem, c as useOutfits, u as useItems, k as useUpdateItem, l as useDeleteItem } from './useData-Ya3GAmCM.mjs';
import { O as OutfitThumbnail } from './OutfitThumbnail-MS8FGvSj.mjs';
import { useState, useRef, useEffect } from 'react';
import { c as Route$3 } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';

function ItemDetailPage() {
  const navigate = useNavigate();
  const {
    itemId
  } = Route$3.useParams();
  const {
    data: item,
    isLoading,
    error
  } = useItem(itemId);
  const {
    data: allOutfits
  } = useOutfits();
  const {
    data: items,
    isLoading: itemsLoading
  } = useItems();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const [isEditing, setIsEditing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    category: "",
    color: "",
    size: "",
    brand: "",
    tags: "",
    notes: ""
  });
  const moreMenuRef = useRef(null);
  useEffect(() => {
    if (item) {
      setEditData({
        name: item.name || "",
        category: item.category || "",
        color: item.color || "",
        size: item.size || "",
        brand: item.brand || "",
        tags: item.tags || "",
        notes: item.notes || ""
      });
    }
  }, [item]);
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
  const handleSaveEdit = async () => {
    try {
      await updateItem.mutateAsync({
        id: itemId,
        data: editData
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Failed to update item");
    }
  };
  const handleCancelEdit = () => {
    if (item) {
      setEditData({
        name: item.name || "",
        category: item.category || "",
        color: item.color || "",
        size: item.size || "",
        brand: item.brand || "",
        tags: item.tags || "",
        notes: item.notes || ""
      });
    }
    setIsEditing(false);
  };
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteItem.mutateAsync(itemId);
      navigate({
        to: "/wardrobe"
      });
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item");
    }
  };
  const outfitsUsingItem = allOutfits?.filter((outfit) => outfit.itemIds.includes(itemId)) || [];
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Loading item..." })
    ] }) });
  }
  if (error || !item) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 dark:text-red-400", children: "Item not found" }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate({
        to: "/wardrobe"
      }), className: "mt-4 text-blue-600 dark:text-blue-400 hover:underline", children: "Back to Wardrobe" })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/wardrobe"
      }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        isEditing ? "Editing Item" : "Item Details"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("button", { onClick: handleCancelEdit, disabled: updateItem.isPending, className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50", title: "Cancel", children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
        /* @__PURE__ */ jsx("button", { onClick: handleSaveEdit, disabled: updateItem.isPending, className: "p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors disabled:opacity-50", title: "Save", children: /* @__PURE__ */ jsx(Check, { className: "w-5 h-5 text-green-600 dark:text-green-400" }) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setIsEditing(true), className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors", title: "Edit", children: /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative", ref: moreMenuRef, children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setShowMoreMenu(!showMoreMenu), className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors", title: "More options", children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" }) }),
          showMoreMenu && /* @__PURE__ */ jsx("div", { className: "absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20", children: /* @__PURE__ */ jsxs("button", { onClick: () => {
            setShowMoreMenu(false);
            handleDelete();
          }, className: "w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
            "Delete Item"
          ] }) })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800", children: item.photo ? /* @__PURE__ */ jsxs("div", { className: "relative w-full", children: [
        /* @__PURE__ */ jsx("img", { src: item.photo, alt: item.name, className: "w-full h-96 object-cover" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-white font-semibold text-lg", children: item.name }),
          /* @__PURE__ */ jsx("p", { className: "text-white/90 text-sm", children: item.category })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-2xl p-12 border border-blue-200 dark:border-blue-800", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx(Shirt, { className: "w-20 h-20 text-blue-400 dark:text-blue-600" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-blue-700 dark:text-blue-400", children: item.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-600 dark:text-blue-500", children: item.category })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: isEditing ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Item Name *" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editData.name, onChange: (e) => setEditData({
            ...editData,
            name: e.target.value
          }), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., Blue Denim Jacket" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Category *" }),
          /* @__PURE__ */ jsxs("select", { value: editData.category, onChange: (e) => setEditData({
            ...editData,
            category: e.target.value
          }), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select Category" }),
            /* @__PURE__ */ jsx("option", { value: "Top", children: "Top" }),
            /* @__PURE__ */ jsx("option", { value: "Bottom", children: "Bottom" }),
            /* @__PURE__ */ jsx("option", { value: "Dress", children: "Dress" }),
            /* @__PURE__ */ jsx("option", { value: "Outerwear", children: "Outerwear" }),
            /* @__PURE__ */ jsx("option", { value: "Shoes", children: "Shoes" }),
            /* @__PURE__ */ jsx("option", { value: "Accessories", children: "Accessories" }),
            /* @__PURE__ */ jsx("option", { value: "Activewear", children: "Activewear" }),
            /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Color" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editData.color, onChange: (e) => setEditData({
            ...editData,
            color: e.target.value
          }), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., Blue" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Size" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editData.size, onChange: (e) => setEditData({
            ...editData,
            size: e.target.value
          }), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., M, L, XL" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Brand" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editData.brand, onChange: (e) => setEditData({
            ...editData,
            brand: e.target.value
          }), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., Nike, Zara" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Tags" }),
          /* @__PURE__ */ jsx("input", { type: "text", value: editData.tags, onChange: (e) => setEditData({
            ...editData,
            tags: e.target.value
          }), className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "e.g., #casual #summer" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Notes" }),
          /* @__PURE__ */ jsx("textarea", { value: editData.notes, onChange: (e) => setEditData({
            ...editData,
            notes: e.target.value
          }), rows: 4, className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Additional notes about this item..." })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mb-4", children: item.name }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Category:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: item.category })
          ] }),
          item.color && /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Color:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: item.color })
          ] }),
          item.size && /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Size:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: item.size })
          ] }),
          item.brand && /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-2 border-b border-gray-100 dark:border-gray-800", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Brand:" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-800 dark:text-gray-100", children: item.brand })
          ] }),
          item.tags && /* @__PURE__ */ jsx("div", { className: "py-2", children: /* @__PURE__ */ jsxs("span", { className: "text-gray-600 dark:text-gray-400", children: [
            "Tags: ",
            item.tags
          ] }) })
        ] }),
        item.notes && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t border-gray-200 dark:border-gray-800", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-600 dark:text-gray-400 mb-2", children: "Notes:" }),
          /* @__PURE__ */ jsx("div", { className: "min-h-[60px] bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 text-sm", children: item.notes })
        ] })
      ] }) }),
      outfitsUsingItem.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100", children: [
            "Used in Outfits (",
            outfitsUsingItem.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx(Link, { to: "/outfits", className: "text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-500", children: "View All Outfits" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: outfitsUsingItem.map((outfit) => /* @__PURE__ */ jsxs(Link, { to: "/outfits/$outfitId", params: {
          outfitId: outfit.id
        }, className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors", children: [
          /* @__PURE__ */ jsx(OutfitThumbnail, { itemIds: outfit.itemIds, items, size: "small", className: "mb-3", loading: itemsLoading }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 text-center truncate", children: outfit.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 text-center truncate", children: outfit.season })
        ] }, outfit.id)) })
      ] })
    ] })
  ] }) });
}

export { ItemDetailPage as component };
//# sourceMappingURL=_itemId-DMh-fXUr.mjs.map
