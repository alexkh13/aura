import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate, Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Shirt } from 'lucide-react';
import { useState, useMemo } from 'react';
import { d as useCalendarEntries, c as useOutfits, u as useItems } from './useData-Ya3GAmCM.mjs';
import { O as OutfitThumbnail } from './OutfitThumbnail-MS8FGvSj.mjs';
import '@tanstack/react-query';
import './router-h1SIfdX4.mjs';

function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const {
    data: calendarEntries
  } = useCalendarEntries();
  const {
    data: outfits
  } = useOutfits();
  const {
    data: items,
    isLoading: itemsLoading
  } = useItems();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({
        date: null,
        dateStr: null
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      days.push({
        date,
        dateStr
      });
    }
    return days;
  }, [currentDate]);
  const selectedEntry = selectedDateStr ? calendarEntries?.find((entry) => entry.id === selectedDateStr) : null;
  const selectedOutfit = selectedEntry?.outfitId ? outfits?.find((outfit) => outfit.id === selectedEntry.outfitId) : null;
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
        to: "/"
      }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        "Calendar"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: goToPreviousMonth, className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center", children: monthName }),
        /* @__PURE__ */ jsx("button", { onClick: goToNextMonth, className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded", children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 mb-3", children: daysOfWeek.map((day) => /* @__PURE__ */ jsx("div", { className: "text-center text-xs font-semibold text-gray-600 dark:text-gray-400", children: day }, day)) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2", children: calendarDays.map((item, idx) => {
          const hasEntry = item.dateStr && calendarEntries?.some((entry) => entry.id === item.dateStr);
          const isSelected = selectedDateStr === item.dateStr;
          const isToday = item.date && item.date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
          return /* @__PURE__ */ jsxs("div", { onClick: () => item.dateStr && setSelectedDateStr(item.dateStr), className: `aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer relative
                      ${item.date ? "hover:bg-blue-50 dark:hover:bg-blue-950" : ""}
                      ${isSelected ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}
                      ${isToday && !isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
                    `, children: [
            item.date?.getDate(),
            hasEntry && /* @__PURE__ */ jsx("div", { className: "absolute bottom-1 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsx(Shirt, { className: "w-3 h-3 text-blue-500 dark:text-blue-400" }) })
          ] }, idx);
        }) })
      ] }),
      selectedDateStr && /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: new Date(selectedDateStr).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) }),
        selectedOutfit ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Link, { to: "/outfits/$outfitId", params: {
            outfitId: selectedOutfit.id
          }, children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mb-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(OutfitThumbnail, { itemIds: selectedOutfit.itemIds, items, size: "small", loading: itemsLoading }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 dark:text-gray-100 mb-1", children: selectedOutfit.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-1", children: [
                "Season: ",
                selectedOutfit.season
              ] }),
              selectedOutfit.occasion && /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                "Occasion: ",
                selectedOutfit.occasion
              ] })
            ] })
          ] }) }),
          selectedEntry.notes && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: selectedEntry.notes }) })
        ] }) : /* @__PURE__ */ jsx("div", { className: "mb-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "No outfit scheduled for this date" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(Link, { to: "/outfits", className: "flex-1 py-2 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors text-center", children: selectedOutfit ? "Change Outfit" : "Add Outfit" }),
          selectedOutfit && /* @__PURE__ */ jsx("button", { onClick: () => {
            alert("Remove outfit functionality coming soon!");
          }, className: "flex-1 py-2 px-4 bg-white dark:bg-gray-800 border-2 border-red-600 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-gray-700 transition-colors", children: "Remove Outfit" })
        ] })
      ] })
    ] })
  ] }) });
}

export { CalendarPage as component };
//# sourceMappingURL=calendar-D13dLD_k.mjs.map
