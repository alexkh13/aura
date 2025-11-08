import { jsxs, jsx } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Key, Sparkles, Save, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { setGoogleAIToken } from './gemini-C5p_oKPn.mjs';
import '@google/generative-ai';

function AISettingsPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const savedToken = localStorage.getItem("google_ai_token") || "";
    setToken(savedToken);
  }, []);
  const handleSave = () => {
    localStorage.setItem("google_ai_token", token);
    setGoogleAIToken(token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-0 z-10", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/settings"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "AI Settings"
    ] }) }) }),
    /* @__PURE__ */ jsxs("main", { className: "max-w-2xl mx-auto p-4 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
          /* @__PURE__ */ jsx(Key, { className: "w-5 h-5 text-purple-500 mt-1" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-purple-500" }),
              "Google AI API Key"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "Required: Add your Google AI API key to use Gemini AI for intelligent clothing analysis." }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("input", { type: "password", value: token, onChange: (e) => setToken(e.target.value), placeholder: "AIza...", className: "w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" }),
              /* @__PURE__ */ jsxs("button", { onClick: handleSave, className: "w-full py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2", children: [
                /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                saved ? "Saved!" : "Save Token"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-blue-700 dark:text-blue-300", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium mb-1", children: "How to get an API key:" }),
            /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-1", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                "Go to ",
                /* @__PURE__ */ jsx("a", { href: "https://aistudio.google.com/app/apikey", target: "_blank", rel: "noopener noreferrer", className: "underline", children: "Google AI Studio" })
              ] }),
              /* @__PURE__ */ jsx("li", { children: 'Click "Create API Key"' }),
              /* @__PURE__ */ jsx("li", { children: "Copy and paste it here" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs", children: "Free tier: 15 requests/minute, 1500 requests/day" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5 text-purple-500" }),
          "About Gemini AI"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm text-gray-600 dark:text-gray-400", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { className: "text-gray-900 dark:text-gray-100", children: "Google Gemini" }),
            " is a powerful multimodal AI that understands images and generates intelligent insights."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "What it analyzes:" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1 ml-2", children: [
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Category:" }),
                " Top, Bottom, Dress, Shoes, etc."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Colors:" }),
                " Primary and secondary colors"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Style:" }),
                " Casual, formal, sporty, elegant"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Occasion:" }),
                " Everyday, work, party, gym"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Season:" }),
                " Summer, winter, all-season"
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Material:" }),
                " Denim, cotton, leather, etc."
              ] }),
              /* @__PURE__ */ jsxs("li", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Pattern:" }),
                " Solid, striped, floral, checkered"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Works with:" }),
            /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-1 ml-2", children: [
              /* @__PURE__ */ jsx("li", { children: "Photos of people wearing clothes" }),
              /* @__PURE__ */ jsx("li", { children: "Flat-lay clothing photos" }),
              /* @__PURE__ */ jsx("li", { children: "Product shots" }),
              /* @__PURE__ */ jsx("li", { children: "Any clothing image" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mt-4", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-700 dark:text-green-300", children: [
            /* @__PURE__ */ jsx("strong", { children: "Free Tier:" }),
            " 15 requests/minute \u2022 1,500 requests/day"
          ] }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs pt-2 border-t border-gray-200 dark:border-gray-800 mt-4", children: [
            "Model: ",
            /* @__PURE__ */ jsx("a", { href: "https://ai.google.dev/gemini-api/docs", target: "_blank", rel: "noopener noreferrer", className: "text-purple-500 underline", children: "Gemini 1.5 Flash" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

export { AISettingsPage as component };
//# sourceMappingURL=ai-DEVW8n11.mjs.map
