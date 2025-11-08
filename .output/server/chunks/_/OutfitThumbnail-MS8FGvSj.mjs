import { jsx, jsxs } from 'react/jsx-runtime';
import { Shirt } from 'lucide-react';
import { useState, useEffect } from 'react';

function OutfitThumbnail({
  itemIds,
  items = [],
  size = "medium",
  className = "",
  loading = false
}) {
  const outfitItems = itemIds.map((id) => items.find((item) => item.id === id)).filter((item) => item !== void 0);
  const itemsWithPhotos = outfitItems.filter((item) => item.hasPhoto && item.photo);
  const displayItems = itemsWithPhotos.slice(0, 6);
  const hasItems = displayItems.length > 0;
  const sizeConfig = {
    small: {
      container: "h-24",
      icon: "w-8 h-8",
      grid: "gap-0.5"
    },
    medium: {
      container: "h-48",
      icon: "w-12 h-12",
      grid: "gap-1"
    },
    large: {
      container: "h-64",
      icon: "w-16 h-16",
      grid: "gap-2"
    }
  };
  const config = sizeConfig[size];
  const getGridLayout = () => {
    const count = displayItems.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2";
    if (count === 4) return "grid-cols-2";
    return "grid-cols-3";
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: `${config.container} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 ${className} overflow-hidden`, children: /* @__PURE__ */ jsx("div", { className: "w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700" }) });
  }
  if (!hasItems) {
    return /* @__PURE__ */ jsx("div", { className: `${config.container} bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800 ${className} flex items-center justify-center`, children: /* @__PURE__ */ jsx(Shirt, { className: `${config.icon} text-blue-400 dark:text-blue-600` }) });
  }
  return /* @__PURE__ */ jsx("div", { className: `${config.container} bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 ${className} overflow-hidden`, children: /* @__PURE__ */ jsx("div", { className: `grid ${getGridLayout()} ${config.grid} w-full h-full`, children: displayItems.map((item, index) => /* @__PURE__ */ jsx(ItemPhoto, { item, index, totalItems: displayItems.length }, item.id)) }) });
}
function ItemPhoto({ item, index, totalItems }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [item.id]);
  const shouldSpanTwoColumns = totalItems === 3 && index === 0;
  if (!item.photo || imageError) {
    return /* @__PURE__ */ jsx("div", { className: `relative bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center ${shouldSpanTwoColumns ? "col-span-2" : ""}`, children: /* @__PURE__ */ jsx(Shirt, { className: "w-6 h-6 text-gray-400 dark:text-gray-600" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: `relative overflow-hidden ${shouldSpanTwoColumns ? "col-span-2" : ""}`, children: [
    !imageLoaded && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" }),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: item.photo,
        alt: item.name,
        loading: "lazy",
        className: `w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`,
        onLoad: () => setImageLoaded(true),
        onError: () => setImageError(true)
      }
    )
  ] });
}

export { OutfitThumbnail as O };
//# sourceMappingURL=OutfitThumbnail-MS8FGvSj.mjs.map
