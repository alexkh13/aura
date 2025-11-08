import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Trash2, Sparkles, X, Image, Camera, Upload, Loader2, Settings, Check } from 'lucide-react';
import { useState, useRef } from 'react';
import { j as useCreateItem, k as useUpdateItem, l as useDeleteItem, u as useItems } from './useData-Ya3GAmCM.mjs';
import { u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';

async function extractGarmentsFromImage(imageFile, progressCallback) {
  try {
    const { extractMultipleGarments } = await import('./gemini-C5p_oKPn.mjs');
    const items = await extractMultipleGarments(imageFile, (message, progress) => {
      progressCallback?.({
        stage: progress < 100 ? "analyzing" : "complete",
        progress,
        message
      });
    });
    return items;
  } catch (error) {
    console.error("Garment extraction failed:", error);
    throw error;
  }
}
async function isGeminiConfigured() {
  return false;
}
async function generateOutfitDetails(itemNames, itemColors, itemCategories) {
  try {
    const { generateOutfitSuggestion } = await import('./gemini-C5p_oKPn.mjs');
    const outfit = await generateOutfitSuggestion(itemNames, itemColors, itemCategories);
    return outfit;
  } catch (error) {
    console.error("Outfit generation failed:", error);
    return null;
  }
}
function AddNewItemPage() {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const {
    activeProfile
  } = useProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiProgress, setAIProgress] = useState({
    message: "",
    progress: 0
  });
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [items, setItems] = useState([{
    name: "",
    category: "",
    color: "",
    size: "",
    brand: "",
    tags: "",
    notes: "",
    hasPhoto: false,
    aiGenerated: false
  }]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOutfitDialog, setShowOutfitDialog] = useState(false);
  const [isGeneratingOutfit, setIsGeneratingOutfit] = useState(false);
  const {
    data: allItems
  } = useItems(activeProfile?.id);
  useState(() => {
    isGeminiConfigured().then(setHasGeminiKey);
  });
  const currentItem = items[currentItemIndex];
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Photo size must be less than 10MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setPhotoPreview(result);
      setItems((items2) => items2.map((item) => ({
        ...item,
        hasPhoto: true
      })));
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setSelectedFile(null);
    setItems((items2) => items2.map((item) => ({
      ...item,
      hasPhoto: false
    })));
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };
  const handleAIAnalyze = async () => {
    if (!selectedFile) return;
    if (!hasGeminiKey) {
      if (confirm("Google AI API key not configured. Go to Settings?")) {
        navigate({
          to: "/settings/ai"
        });
      }
      return;
    }
    setIsAnalyzing(true);
    try {
      const extractedItems = await extractGarmentsFromImage(selectedFile, (progress) => {
        setAIProgress({
          message: progress.message,
          progress: progress.progress
        });
      });
      if (extractedItems.length === 0) {
        alert("No garments detected in this image. Please try a different photo.");
        return;
      }
      const newItems = extractedItems.map((aiItem) => ({
        name: aiItem.name,
        category: aiItem.category,
        color: aiItem.color || "",
        size: "",
        brand: "",
        tags: aiItem.tags || "",
        notes: aiItem.notes || "",
        hasPhoto: true,
        aiGenerated: true,
        imageData: aiItem.imageData,
        // Store AI-generated product image
        metadata: aiItem.metadata
      }));
      console.log("\u2705 Created items with AI-generated images:", newItems.map((item) => ({
        name: item.name,
        hasImageData: !!item.imageData,
        imageDataSize: item.imageData?.length
      })));
      setItems(newItems);
      setCurrentItemIndex(0);
    } catch (error) {
      console.error("AI analysis failed:", error);
      alert(error instanceof Error ? error.message : "AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const updateCurrentItem = (updates) => {
    setItems((items2) => items2.map((item, i) => i === currentItemIndex ? {
      ...item,
      ...updates
    } : item));
  };
  const handleSave = async () => {
    if (!currentItem.name.trim() || !currentItem.category.trim()) {
      alert("Please fill in the required fields: Name and Category");
      return;
    }
    if (!activeProfile) {
      alert("No active profile selected");
      return;
    }
    try {
      let itemId;
      if (currentItem.saved && currentItem.id) {
        await updateItem.mutateAsync({
          id: currentItem.id,
          data: {
            name: currentItem.name.trim(),
            category: currentItem.category.trim(),
            hasPhoto: currentItem.hasPhoto,
            photo: currentItem.imageData || photoPreview || "",
            color: currentItem.color.trim() || "",
            size: currentItem.size.trim() || "",
            brand: currentItem.brand.trim() || "",
            tags: currentItem.tags.trim() || "",
            notes: currentItem.notes.trim() || ""
          }
        });
        itemId = currentItem.id;
      } else {
        const savedItem = await createItem.mutateAsync({
          name: currentItem.name.trim(),
          category: currentItem.category.trim(),
          hasPhoto: currentItem.hasPhoto,
          photo: currentItem.imageData || photoPreview || "",
          // Use AI-generated image if available
          color: currentItem.color.trim() || "",
          size: currentItem.size.trim() || "",
          brand: currentItem.brand.trim() || "",
          tags: currentItem.tags.trim() || "",
          notes: currentItem.notes.trim() || "",
          profileId: activeProfile.id
        });
        itemId = savedItem.id;
        setItems((items2) => items2.map((item, i) => i === currentItemIndex ? {
          ...item,
          id: itemId,
          saved: true
        } : item));
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1e3);
      const allSaved = items.every((item, i) => i === currentItemIndex || item.saved);
      if (allSaved) {
        setTimeout(() => setShowOutfitDialog(true), 1e3);
      } else {
        const nextUnsavedIndex = items.findIndex((item, i) => i !== currentItemIndex && !item.saved);
        if (nextUnsavedIndex !== -1) {
          setTimeout(() => setCurrentItemIndex(nextUnsavedIndex), 1e3);
        }
      }
    } catch (error) {
      console.error("Failed to save item:", error);
      alert(`Failed to save item: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };
  const handleRemove = async () => {
    if (currentItem.saved && currentItem.id) {
      const confirmDelete = confirm(`Are you sure you want to remove "${currentItem.name}"?`);
      if (!confirmDelete) return;
      try {
        await deleteItem.mutateAsync(currentItem.id);
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert(`Failed to delete item: ${error instanceof Error ? error.message : "Unknown error"}`);
        return;
      }
    }
    const newItems = items.filter((_, i) => i !== currentItemIndex);
    if (newItems.length === 0) {
      navigate({
        to: "/wardrobe"
      });
    } else {
      setItems(newItems);
      if (currentItemIndex >= newItems.length) {
        setCurrentItemIndex(newItems.length - 1);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };
  const handleCreateOutfit = async () => {
    setIsGeneratingOutfit(true);
    const savedItemIds = items.filter((item) => item.saved && item.id).map((item) => item.id);
    const savedItems = allItems?.filter((item) => savedItemIds.includes(item.id)) || [];
    let aiGeneratedData = null;
    if (hasGeminiKey && savedItems.length > 0) {
      try {
        const itemNames = savedItems.map((item) => item.name);
        const itemColors = savedItems.map((item) => item.color || "Unknown");
        const itemCategories = savedItems.map((item) => item.category);
        aiGeneratedData = await generateOutfitDetails(itemNames, itemColors, itemCategories);
      } catch (error) {
        console.error("Failed to generate outfit suggestions:", error);
      }
    }
    setIsGeneratingOutfit(false);
    navigate({
      to: "/outfits/new",
      state: {
        preSelectedItemIds: savedItemIds,
        aiGeneratedData
      }
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", onKeyDown: handleKeyDown, children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-0 z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
          to: "/wardrobe"
        }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
          "Add Item"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          items.length > 1 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mr-2", children: [
            items.map((_, index) => /* @__PURE__ */ jsx("button", { onClick: () => setCurrentItemIndex(index), className: `w-2 h-2 rounded-full transition-all ${index === currentItemIndex ? "w-6 bg-purple-500" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"}`, "aria-label": `Go to item ${index + 1}` }, index)),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500 ml-1", children: [
              currentItemIndex + 1,
              "/",
              items.length
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: handleRemove, disabled: deleteItem.isPending, className: "p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50", title: currentItem.saved ? "Remove item" : "Discard item", children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsx("button", { onClick: handleSave, disabled: createItem.isPending || updateItem.isPending || showSuccess, className: "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50", children: createItem.isPending || updateItem.isPending ? currentItem.saved ? "Updating..." : "Saving..." : showSuccess ? "Saved!" : currentItem.saved ? "Update" : "Save" })
        ] })
      ] }),
      currentItem.aiGenerated && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }),
        "AI-generated \u2022 Review and edit before saving"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Photo" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
          currentItem.imageData || photoPreview ? /* @__PURE__ */ jsxs("div", { className: "relative w-full aspect-square", children: [
            /* @__PURE__ */ jsx("img", { src: currentItem.imageData || photoPreview, alt: "Item preview", className: "w-full h-full object-cover rounded-xl" }),
            currentItem.aiGenerated && currentItem.imageData && /* @__PURE__ */ jsxs("div", { className: "absolute top-2 left-2 px-2 py-1 bg-purple-500/90 text-white text-xs rounded-full flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3" }),
              "AI Generated"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: handleRemovePhoto, className: "absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
          ] }) : /* @__PURE__ */ jsx("div", { className: "w-full aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center", children: /* @__PURE__ */ jsx(Image, { className: "w-16 h-16 text-blue-300 dark:text-blue-700" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 w-full", children: [
            /* @__PURE__ */ jsx("input", { ref: cameraInputRef, type: "file", accept: "image/*", capture: "environment", onChange: handlePhotoChange, className: "hidden" }),
            /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handlePhotoChange, className: "hidden" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => cameraInputRef.current?.click(), className: "flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2", disabled: isAnalyzing, children: [
              /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5" }),
              "Camera"
            ] }),
            /* @__PURE__ */ jsxs("button", { onClick: () => fileInputRef.current?.click(), className: "flex-1 py-3 bg-white dark:bg-gray-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2", disabled: isAnalyzing, children: [
              /* @__PURE__ */ jsx(Upload, { className: "w-5 h-5" }),
              "Upload"
            ] })
          ] }),
          photoPreview && !currentItem.aiGenerated && /* @__PURE__ */ jsx("button", { onClick: handleAIAnalyze, disabled: isAnalyzing, className: "w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2", children: isAnalyzing ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
            aiProgress.message
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5" }),
            "AI Analyze Photo"
          ] }) }),
          !hasGeminiKey && photoPreview && /* @__PURE__ */ jsxs("div", { className: "w-full p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 text-xs text-amber-700 dark:text-amber-300", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => navigate({
                to: "/settings/ai"
              }), className: "underline font-medium", children: "Add Google AI key" }),
              " ",
              "to use AI analysis"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-lg font-semibold mb-4", children: [
          "Details",
          items.length > 1 && ` (Item ${currentItemIndex + 1} of ${items.length})`
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium mb-2", children: [
              "Name ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Blue Denim Jacket", value: currentItem.name, onChange: (e) => updateCurrentItem({
              name: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium mb-2", children: [
              "Category ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs("select", { value: currentItem.category, onChange: (e) => updateCurrentItem({
              category: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none", children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select category" }),
              /* @__PURE__ */ jsx("option", { value: "Top", children: "Top" }),
              /* @__PURE__ */ jsx("option", { value: "Bottom", children: "Bottom" }),
              /* @__PURE__ */ jsx("option", { value: "Dress", children: "Dress" }),
              /* @__PURE__ */ jsx("option", { value: "Outerwear", children: "Outerwear" }),
              /* @__PURE__ */ jsx("option", { value: "Shoes", children: "Shoes" }),
              /* @__PURE__ */ jsx("option", { value: "Accessories", children: "Accessories" }),
              /* @__PURE__ */ jsx("option", { value: "Activewear", children: "Activewear" }),
              /* @__PURE__ */ jsx("option", { value: "Swimwear", children: "Swimwear" }),
              /* @__PURE__ */ jsx("option", { value: "Underwear", children: "Underwear" }),
              /* @__PURE__ */ jsx("option", { value: "Other", children: "Other" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Color" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Blue", value: currentItem.color, onChange: (e) => updateCurrentItem({
              color: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Size" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-2 mb-2", children: ["XS", "S", "M", "L", "XL", "2XL", "3XL"].map((size) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => updateCurrentItem({
              size
            }), className: `py-2 text-sm rounded-lg border transition-colors ${currentItem.size === size ? "bg-blue-500 text-white border-blue-500" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-blue-400"}`, children: size }, size)) }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Or custom size", value: !["XS", "S", "M", "L", "XL", "2XL", "3XL"].includes(currentItem.size) ? currentItem.size : "", onChange: (e) => updateCurrentItem({
              size: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Brand" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., Nike", value: currentItem.brand, onChange: (e) => updateCurrentItem({
              brand: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Tags" }),
            /* @__PURE__ */ jsx("input", { type: "text", placeholder: "e.g., #casual #summer", value: currentItem.tags, onChange: (e) => updateCurrentItem({
              tags: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-2", children: "Notes" }),
            /* @__PURE__ */ jsx("textarea", { rows: 3, placeholder: "Add notes...", value: currentItem.notes, onChange: (e) => updateCurrentItem({
              notes: e.target.value
            }), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" })
          ] }),
          currentItem.metadata && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4 text-purple-600" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-purple-600 dark:text-purple-400", children: "AI Insights" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
              currentItem.metadata.style && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Style:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: currentItem.metadata.style })
              ] }),
              currentItem.metadata.occasion && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Occasion:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: currentItem.metadata.occasion })
              ] }),
              currentItem.metadata.season && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Season:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: currentItem.metadata.season })
              ] }),
              currentItem.metadata.material && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Material:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: currentItem.metadata.material })
              ] }),
              currentItem.metadata.pattern && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Pattern:" }),
                " ",
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: currentItem.metadata.pattern })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    showSuccess && /* @__PURE__ */ jsx("div", { className: "fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce", children: /* @__PURE__ */ jsxs("div", { className: "bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Check, { className: "w-5 h-5" }),
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Item saved!" })
    ] }) }),
    showOutfitDialog && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-3", children: "All Items Saved!" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-6", children: (() => {
        const savedCount = items.filter((item) => item.saved && item.id).length;
        return `You've successfully saved ${savedCount} ${savedCount === 1 ? "item" : "items"}. Would you like to create an outfit with ${savedCount === 1 ? "this item" : "these items"}?`;
      })() }),
      hasGeminiKey && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300", children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: "AI will suggest outfit details" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => {
          setShowOutfitDialog(false);
          navigate({
            to: "/wardrobe"
          });
        }, disabled: isGeneratingOutfit, className: "flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50", children: "No, Thanks" }),
        /* @__PURE__ */ jsx("button", { onClick: handleCreateOutfit, disabled: isGeneratingOutfit, className: "flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2", children: isGeneratingOutfit ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
          "Generating..."
        ] }) : "Create Outfit" })
      ] })
    ] }) })
  ] }) });
}

export { AddNewItemPage as component };
//# sourceMappingURL=new-IiPr_tCJ.mjs.map
