import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Plus, User, Check, Trash2, Star } from 'lucide-react';
import { a as useProfiles, b as useDeleteProfile, u as useItems, c as useOutfits } from './useData-Ya3GAmCM.mjs';
import { u as useProfile } from './router-h1SIfdX4.mjs';
import '@tanstack/react-query';
import 'react';

function ProfilePage() {
  const navigate = useNavigate();
  const {
    data: profiles,
    isLoading: profilesLoading
  } = useProfiles();
  const {
    activeProfile,
    setActiveProfile
  } = useProfile();
  const deleteProfile = useDeleteProfile();
  const handleSelectProfile = (profile) => {
    setActiveProfile(profile);
  };
  const handleCreateProfile = () => {
    navigate({
      to: "/profiles/new"
    });
  };
  const handleDeleteProfile = async (profileId, profileName) => {
    if (!confirm(`Are you sure you want to delete "${profileName}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const profileToDelete = profiles?.find((p) => p.id === profileId);
      if (profileToDelete?.isDefault && profiles) {
        const defaultProfiles = profiles.filter((p) => p.isDefault);
        if (defaultProfiles.length <= 1) {
          alert("Cannot delete the only default profile");
          return;
        }
      }
      await deleteProfile.mutateAsync(profileId);
      if (activeProfile?.id === profileId && profiles) {
        const remainingProfiles = profiles.filter((p) => p.id !== profileId);
        if (remainingProfiles.length > 0) {
          setActiveProfile(remainingProfiles[0]);
        }
      }
    } catch (error) {
      alert(error.message || "Failed to delete profile");
    }
  };
  if (profilesLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
        "Profiles"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "px-4 py-8 text-center text-gray-500 dark:text-gray-400", children: "Loading profiles..." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-950 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate({
      to: "/"
    }), className: "flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium", children: [
      /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      "Profiles"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6 space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100", children: "My Profiles" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "Switch between wardrobes or create a new one" })
      ] }) }),
      /* @__PURE__ */ jsxs("button", { onClick: handleCreateProfile, className: "w-full py-4 px-4 bg-blue-500 dark:bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx(Plus, { className: "w-5 h-5" }),
        "Create New Profile"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: profiles && profiles.length > 0 ? profiles.map((profile, index) => {
        const firstDefaultIndex = profiles.findIndex((p) => p.isDefault);
        const canDelete = !profile.isDefault || profile.isDefault && index !== firstDefaultIndex;
        return /* @__PURE__ */ jsx(ProfileCard, { profile, isActive: activeProfile?.id === profile.id, canDelete, onSelect: () => handleSelectProfile(profile), onDelete: () => handleDeleteProfile(profile.id, profile.name) }, profile.id);
      }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-12 text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ jsx(User, { className: "w-12 h-12 mx-auto mb-3 opacity-40" }),
        /* @__PURE__ */ jsx("p", { children: "No profiles found" })
      ] }) })
    ] })
  ] }) });
}
function ProfileCard({
  profile,
  isActive,
  canDelete,
  onSelect,
  onDelete
}) {
  const {
    data: items
  } = useItems(profile.id);
  const {
    data: outfits
  } = useOutfits(profile.id);
  const itemCount = items?.length || 0;
  const outfitCount = outfits?.length || 0;
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };
  return /* @__PURE__ */ jsxs("div", { className: `relative w-full text-left p-5 rounded-xl border-2 transition-all ${isActive ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"}`, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3", children: isActive ? /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-white" }) }) : canDelete ? /* @__PURE__ */ jsx("button", { onClick: handleDelete, className: "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors", title: "Delete profile", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) }) : null }),
    /* @__PURE__ */ jsxs("button", { onClick: onSelect, className: "w-full text-left pr-10", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-start mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-full flex items-center justify-center text-lg ${profile.avatar ? "bg-gray-100 dark:bg-gray-800" : "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950"}`, children: profile.avatar || /* @__PURE__ */ jsx(User, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 dark:text-gray-100", children: profile.name }),
            profile.isDefault && /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-yellow-500 fill-yellow-500" })
          ] }),
          profile.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-0.5", children: profile.description })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-gray-600 dark:text-gray-400", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: itemCount }),
          "items"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-gray-600 dark:text-gray-400", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: outfitCount }),
          "outfits"
        ] })
      ] })
    ] })
  ] });
}

export { ProfilePage as component };
//# sourceMappingURL=profile-DvW6ivNf.mjs.map
