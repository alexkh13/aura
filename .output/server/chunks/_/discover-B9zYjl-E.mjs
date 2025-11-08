import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Wind, Layers, Shirt, Sparkles } from 'lucide-react';

function DiscoverPage() {
  const navigate = useNavigate();
  const seasonalTrends = [{
    id: "layered-look",
    name: "Layered Look",
    icon: Layers,
    color: "text-amber-600 dark:text-amber-400"
  }, {
    id: "cozy-knits",
    name: "Cozy Knits",
    icon: Shirt,
    color: "text-orange-600 dark:text-orange-400"
  }, {
    id: "earth-tones",
    name: "Earth Tones",
    icon: Sparkles,
    color: "text-green-600 dark:text-green-400"
  }];
  const curatedOutfits = [{
    id: "white-shirt",
    title: "5 Ways to Style a White Shirt",
    gradient: "from-sky-100 to-blue-200 dark:from-sky-900 dark:to-blue-800",
    description: "Classic versatility"
  }, {
    id: "business-casual",
    title: "Business Casual Essentials",
    gradient: "from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-700",
    description: "Professional polish"
  }, {
    id: "weekend-comfort",
    title: "Weekend Comfort Guide",
    gradient: "from-indigo-100 to-purple-200 dark:from-indigo-900 dark:to-purple-800",
    description: "Effortless style"
  }, {
    id: "capsule-wardrobe",
    title: "Capsule Wardrobe Basics",
    gradient: "from-emerald-100 to-teal-200 dark:from-emerald-900 dark:to-teal-800",
    description: "Minimalist approach"
  }, {
    id: "seasonal-transition",
    title: "Seasonal Transition Looks",
    gradient: "from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-800",
    description: "Weather-ready style"
  }, {
    id: "date-night",
    title: "Date Night Outfits",
    gradient: "from-rose-100 to-pink-200 dark:from-rose-900 dark:to-pink-800",
    description: "Confident elegance"
  }];
  const styleArticles = [{
    id: "color-coordination",
    title: "Color Coordination 101",
    gradient: "from-violet-100 to-purple-200 dark:from-violet-900 dark:to-purple-800",
    category: "Basics"
  }, {
    id: "accessorize-pro",
    title: "Accessorize Like a Pro",
    gradient: "from-fuchsia-100 to-pink-200 dark:from-fuchsia-900 dark:to-pink-800",
    category: "Tips"
  }, {
    id: "mix-match-patterns",
    title: "Mix and Match Patterns",
    gradient: "from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-800",
    category: "Advanced"
  }, {
    id: "body-type-guide",
    title: "Dress for Your Body Type",
    gradient: "from-lime-100 to-green-200 dark:from-lime-900 dark:to-green-800",
    category: "Guide"
  }, {
    id: "sustainable-fashion",
    title: "Sustainable Fashion Tips",
    gradient: "from-teal-100 to-cyan-200 dark:from-teal-900 dark:to-cyan-800",
    category: "Eco"
  }, {
    id: "confidence-style",
    title: "Building Confidence Through Style",
    gradient: "from-orange-100 to-amber-200 dark:from-orange-900 dark:to-amber-800",
    category: "Mindset"
  }];
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "Discover"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-2xl p-6 border border-amber-100 dark:border-amber-900", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-3", children: /* @__PURE__ */ jsx(Wind, { className: "w-10 h-10 text-amber-600 dark:text-amber-400" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-800 dark:text-gray-100 mb-1", children: "Today's Trend" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-amber-700 dark:text-amber-400", children: "Fall Layering" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Master the art of seasonal transitions" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-3 mb-4 overflow-x-auto pb-2", children: seasonalTrends.map((trend) => {
          const Icon = trend.icon;
          return /* @__PURE__ */ jsxs("div", { onClick: () => navigate({
            to: "/trends/$trendId",
            params: {
              trendId: trend.id
            }
          }), className: "flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-3 min-w-[90px] flex flex-col items-center gap-2 border border-amber-200 dark:border-amber-800 cursor-pointer hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all", children: [
            /* @__PURE__ */ jsx(Icon, { className: `w-8 h-8 ${trend.color}` }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300 text-center", children: trend.name })
          ] }, trend.name);
        }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => navigate({
          to: "/trends"
        }), className: "w-full py-2.5 px-4 bg-amber-600 dark:bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 dark:hover:bg-amber-700 transition-colors", children: "Explore More Trends" })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: "Curated Outfit Guides" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: curatedOutfits.map((article, idx) => /* @__PURE__ */ jsxs("div", { onClick: () => navigate({
          to: "/guides/$guideId",
          params: {
            guideId: article.id
          }
        }), className: "bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-md cursor-pointer", children: [
          /* @__PURE__ */ jsxs("div", { className: `aspect-[3/4] bg-gradient-to-br ${article.gradient} flex flex-col items-center justify-center p-4`, children: [
            /* @__PURE__ */ jsx(Shirt, { className: "w-12 h-12 text-white/80 mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/90 font-medium text-center", children: article.description })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2", children: article.title }) })
        ] }, idx)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4", children: "Style Tips & Articles" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-4", children: styleArticles.map((article, idx) => /* @__PURE__ */ jsxs("div", { onClick: () => navigate({
          to: "/articles/$articleId",
          params: {
            articleId: article.id
          }
        }), className: "bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-md cursor-pointer", children: [
          /* @__PURE__ */ jsxs("div", { className: `aspect-video bg-gradient-to-br ${article.gradient} flex items-center justify-center relative`, children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-8 h-8 text-white/80" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-2 right-2 text-[10px] font-bold text-white/90 bg-black/20 px-2 py-0.5 rounded-full", children: article.category })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2", children: article.title }) })
        ] }, idx)) })
      ] })
    ] })
  ] }) });
}

export { DiscoverPage as component };
//# sourceMappingURL=discover-B9zYjl-E.mjs.map
