import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { f as useCreateProfile } from './useData-Ya3GAmCM.mjs';
import { u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';

const EMOJI_OPTIONS = ["\u{1F454}", "\u{1F457}", "\u{1F460}", "\u{1F45F}", "\u{1F3A8}", "\u2728", "\u{1F4BC}", "\u{1F31F}", "\u{1F3AD}", "\u{1F338}", "\u{1F525}", "\u{1F48E}"];
function NewProfilePage() {
  const navigate = useNavigate();
  const createProfile = useCreateProfile();
  const {
    setActiveProfile
  } = useProfile();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("\u{1F454}");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const newProfile = await createProfile.mutateAsync({
        name: name.trim(),
        description: description.trim() || void 0,
        avatar: selectedEmoji,
        isDefault: false
      });
      setActiveProfile(newProfile);
      navigate({
        to: "/profile"
      });
    } catch (error) {
      console.error("Failed to create profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/profile"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "Create New Profile"
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Profile Icon" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 gap-2", children: EMOJI_OPTIONS.map((emoji) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setSelectedEmoji(emoji), className: `w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${selectedEmoji === emoji ? "bg-blue-100 dark:bg-blue-950 ring-2 ring-blue-500 dark:ring-blue-500" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"}`, children: emoji }, emoji)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Profile Name *" }),
          /* @__PURE__ */ jsx("input", { type: "text", id: "name", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g., Work Wardrobe, Casual, Vintage Collection", className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent", required: true, maxLength: 50 })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Description (Optional)" }),
          /* @__PURE__ */ jsx("textarea", { id: "description", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Describe this wardrobe collection...", rows: 3, className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent resize-none", maxLength: 200 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Preview" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center text-lg bg-gray-100 dark:bg-gray-800", children: selectedEmoji }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900 dark:text-gray-100", children: name || "Profile Name" }),
            description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-0.5", children: description })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: !name.trim() || isSubmitting, className: "w-full py-3 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Creating..." : "Create Profile" })
    ] })
  ] }) });
}

export { NewProfilePage as component };
//# sourceMappingURL=new-HBYuS551.mjs.map
