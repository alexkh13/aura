import { createRouter, createRootRoute, createFileRoute, lazyRouteComponent, HeadContent, Scripts, Link } from '@tanstack/react-router';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { ChevronDown, Bell, User, Settings, Home, Shirt, Plus, Lightbulb, Calendar } from 'lucide-react';
import { useState, useEffect, createContext, useContext } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const profileSchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100
    },
    name: {
      type: "string"
    },
    isDefault: {
      type: "boolean"
    },
    avatar: {
      type: "string"
    },
    description: {
      type: "string"
    },
    createdAt: {
      type: "number"
    },
    updatedAt: {
      type: "number"
    }
  },
  required: ["id", "name", "isDefault", "createdAt", "updatedAt"]
};
const itemSchema = {
  version: 2,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100
    },
    name: {
      type: "string"
    },
    category: {
      type: "string"
    },
    hasPhoto: {
      type: "boolean"
    },
    photo: {
      type: "string"
    },
    color: {
      type: "string"
    },
    size: {
      type: "string"
    },
    brand: {
      type: "string"
    },
    tags: {
      type: "string"
    },
    notes: {
      type: "string"
    },
    profileId: {
      type: "string"
    },
    createdAt: {
      type: "number"
    },
    updatedAt: {
      type: "number"
    }
  },
  required: ["id", "name", "category", "hasPhoto", "profileId", "createdAt", "updatedAt"]
};
const outfitSchema = {
  version: 1,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100
    },
    name: {
      type: "string"
    },
    season: {
      type: "string"
    },
    occasion: {
      type: "string"
    },
    weather: {
      type: "string"
    },
    tags: {
      type: "string"
    },
    notes: {
      type: "string"
    },
    itemIds: {
      type: "array",
      items: {
        type: "string"
      }
    },
    profileId: {
      type: "string"
    },
    createdAt: {
      type: "number"
    },
    updatedAt: {
      type: "number"
    }
  },
  required: ["id", "name", "season", "itemIds", "profileId", "createdAt", "updatedAt"]
};
const calendarEntrySchema = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100
    },
    date: {
      type: "string"
    },
    outfitId: {
      type: "string"
    },
    notes: {
      type: "string"
    },
    createdAt: {
      type: "number"
    },
    updatedAt: {
      type: "number"
    }
  },
  required: ["id", "date", "createdAt", "updatedAt"]
};
let dbPromise = null;
async function initDatabase() {
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = (async () => {
    try {
      console.log("\u{1F527} Initializing RxDB database...");
      const { createRxDatabase, addRxPlugin } = await import('rxdb');
      const { getRxStorageDexie } = await import('rxdb/plugins/storage-dexie');
      const { RxDBMigrationSchemaPlugin } = await import('rxdb/plugins/migration-schema');
      addRxPlugin(RxDBMigrationSchemaPlugin);
      if (false) ;
      let storage;
      if (false) ;
      else {
        storage = getRxStorageDexie();
      }
      const db = await createRxDatabase({
        name: "aurawardrobedb",
        storage,
        multiInstance: false,
        ignoreDuplicate: true
      });
      console.log("\u2705 Database created successfully");
      console.log("\u{1F4E6} Adding collections...");
      await db.addCollections({
        profiles: {
          schema: profileSchema
        }
      });
      const profilesCollection = db.profiles;
      let defaultProfile = await profilesCollection.findOne({ selector: { isDefault: true } }).exec();
      if (!defaultProfile) {
        console.log("\u{1F4DD} Creating default profile...");
        const now = Date.now();
        defaultProfile = await profilesCollection.insert({
          id: `profile_${now}_default`,
          name: "My Wardrobe",
          isDefault: true,
          createdAt: now,
          updatedAt: now
        });
        console.log("\u2705 Default profile created:", defaultProfile.id);
      }
      const defaultProfileId = defaultProfile.id;
      await db.addCollections({
        items: {
          schema: itemSchema,
          migrationStrategies: {
            1: (oldDoc) => {
              return {
                ...oldDoc,
                photo: ""
              };
            },
            2: (oldDoc) => {
              return {
                ...oldDoc,
                profileId: defaultProfileId
              };
            }
          }
        },
        outfits: {
          schema: outfitSchema,
          migrationStrategies: {
            1: (oldDoc) => {
              return {
                ...oldDoc,
                profileId: defaultProfileId
              };
            }
          }
        },
        calendar_entries: {
          schema: calendarEntrySchema
        }
      });
      console.log("\u2705 Collections added successfully");
      console.log("\u2728 Clean wardrobe initialized - ready for new creations!");
      return db;
    } catch (error) {
      console.error("\u274C Failed to initialize database:", error);
      throw error;
    }
  })();
  return dbPromise;
}
async function getDatabase() {
  {
    throw new Error("Database can only be accessed in the browser");
  }
}
const ProfileContext = createContext(void 0);
function ProfileProvider({ children }) {
  const [activeProfile, setActiveProfileState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const db = await getDatabase();
        const profiles = await db.profiles.find().exec();
        let defaultProfile = null;
        if (profiles.length === 0) {
          console.log("\u{1F4DD} Creating default profile...");
          const now = Date.now();
          const newProfile = await db.profiles.insert({
            id: `profile_${now}_default`,
            name: "My Wardrobe",
            isDefault: true,
            createdAt: now,
            updatedAt: now
          });
          defaultProfile = newProfile.toJSON();
          console.log("\u2705 Default profile created:", defaultProfile.id);
        } else {
          const storedProfileId = localStorage.getItem("activeProfileId");
          if (storedProfileId) {
            const storedProfile = await db.profiles.findOne(storedProfileId).exec();
            if (storedProfile) {
              defaultProfile = storedProfile.toJSON();
              console.log("\u2705 Loaded active profile from storage:", defaultProfile.id);
            }
          }
          if (!defaultProfile) {
            const dbDefaultProfile = await db.profiles.findOne({ selector: { isDefault: true } }).exec();
            if (dbDefaultProfile) {
              defaultProfile = dbDefaultProfile.toJSON();
              console.log("\u2705 Loaded default profile:", defaultProfile.id);
            } else {
              defaultProfile = profiles[0].toJSON();
              console.log("\u2705 Using first available profile:", defaultProfile.id);
            }
          }
        }
        if (defaultProfile) {
          setActiveProfileState(defaultProfile);
          localStorage.setItem("activeProfileId", defaultProfile.id);
          localStorage.setItem(`profile_${defaultProfile.id}`, JSON.stringify(defaultProfile));
        }
      } catch (error) {
        console.error("Failed to initialize profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeProfile();
  }, []);
  const setActiveProfile = (profile) => {
    setActiveProfileState(profile);
    localStorage.setItem("activeProfileId", profile.id);
    localStorage.setItem(`profile_${profile.id}`, JSON.stringify(profile));
  };
  return /* @__PURE__ */ jsx(ProfileContext.Provider, { value: { activeProfile, setActiveProfile, isLoading }, children });
}
function useProfile() {
  const context = useContext(ProfileContext);
  if (context === void 0) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
function Header() {
  const { activeProfile } = useProfile();
  return /* @__PURE__ */ jsx("header", { className: "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center h-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "text-blue-500 dark:text-blue-400", children: /* @__PURE__ */ jsxs("svg", { className: "w-8 h-8", viewBox: "0 0 24 24", fill: "currentColor", children: [
          /* @__PURE__ */ jsx("path", { d: "M12 2c-1.5 0-2 1-2 2v1c0 0.5 0.5 1 1 1h2c0.5 0 1-0.5 1-1V4c0-1-0.5-2-2-2z" }),
          /* @__PURE__ */ jsx("path", { d: "M12 6L5 20c-0.5 1 0 2 1 2h12c1 0 1.5-1 1-2L12 6z M12 14l-3 5h6l-3-5z", fillRule: "evenodd" })
        ] }) }),
        /* @__PURE__ */ jsxs("span", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: [
          "Aura",
          /* @__PURE__ */ jsx("span", { className: "text-sm font-normal text-gray-600 dark:text-gray-400 ml-1", children: "Wardrobe" })
        ] })
      ] }),
      activeProfile && /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/profile",
          className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
          children: [
            activeProfile.avatar && /* @__PURE__ */ jsx("span", { className: "text-sm", children: activeProfile.avatar }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: activeProfile.name }),
            /* @__PURE__ */ jsx(ChevronDown, { className: "w-3.5 h-3.5 text-gray-500 dark:text-gray-400" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/notifications",
          className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
          children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" })
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/profile",
          className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
          children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" })
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/settings",
          className: "p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors",
          children: /* @__PURE__ */ jsx(Settings, { className: "w-5 h-5 text-gray-600 dark:text-gray-400" })
        }
      )
    ] })
  ] }) }) });
}
function ActionDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black/50 z-40 transition-opacity",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-64 animate-in slide-in-from-bottom-2 duration-200", children: /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "p-2 space-y-1", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/items/new",
          onClick: onClose,
          className: "flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group",
          children: [
            /* @__PURE__ */ jsx("div", { className: "bg-purple-100 dark:bg-purple-900 p-3 rounded-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Shirt, { className: "w-6 h-6 text-purple-600 dark:text-purple-400" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: "New Item" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Add to wardrobe" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/outfits/new",
          onClick: onClose,
          className: "flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group",
          children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-100 dark:bg-blue-900 p-3 rounded-xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6 text-blue-600 dark:text-blue-400" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: "New Outfit" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Create combination" })
            ] })
          ]
        }
      )
    ] }) }) })
  ] });
}
function BottomNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ActionDrawer, { isOpen: isDrawerOpen, onClose: () => setIsDrawerOpen(false) }),
    /* @__PURE__ */ jsx("nav", { className: "fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-md mx-auto px-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-around py-1", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/wardrobe",
          className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
          activeProps: {
            className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400"
          },
          children: [
            /* @__PURE__ */ jsx(Home, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium", children: "Wardrobe" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/outfits",
          className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
          activeProps: {
            className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400"
          },
          children: [
            /* @__PURE__ */ jsx(Shirt, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium", children: "Outfits" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsDrawerOpen(true),
          className: "flex flex-col items-center gap-0.5 -mt-3 -translate-y-[2vh]",
          children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors active:scale-95", children: /* @__PURE__ */ jsx(Plus, { className: "w-6 h-6 text-white" }) })
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/discover",
          className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
          activeProps: {
            className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400"
          },
          children: [
            /* @__PURE__ */ jsx(Lightbulb, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium", children: "Discover" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/calendar",
          className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
          activeProps: {
            className: "flex flex-col items-center gap-0.5 py-1.5 px-3 text-blue-600 dark:text-blue-400"
          },
          children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium", children: "Calendar" })
          ]
        }
      )
    ] }) }) })
  ] });
}
const ThemeContext = createContext(void 0);
function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [resolvedTheme, setResolvedTheme] = useState("light");
  const getSystemTheme = () => {
    return "light";
  };
  const resolveTheme = (currentTheme) => {
    if (currentTheme === "system") {
      return getSystemTheme();
    }
    return currentTheme;
  };
  useEffect(() => {
  }, []);
  useEffect(() => {
    return;
  }, [theme]);
  useEffect(() => {
    return;
  }, [resolvedTheme]);
  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { theme, resolvedTheme, setTheme }, children });
}
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1e3 * 60 * 5,
      // 5 minutes
      gcTime: 1e3 * 60 * 30,
      // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
function QueryProvider({ children }) {
  const [dbReady, setDbReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    initDatabase().then(() => {
      console.log("\u2705 Database initialized successfully");
      setDbReady(true);
    }).catch((error) => {
      console.error("\u274C Failed to initialize database:", error);
      setDbReady(true);
    });
  }, []);
  if (!isClient) {
    return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children });
  }
  if (!dbReady) {
    return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "Initializing database..." })
    ] }) }) });
  }
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children });
}
const appCss = "/assets/styles-9rorkhM_.css";
const Route$p = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Aura"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs(ProfileProvider, { children: [
        /* @__PURE__ */ jsx(Header, {}),
        children,
        /* @__PURE__ */ jsx(BottomNav, {})
      ] }) }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$o = () => import('./wardrobe-D6XD9N7F.mjs');
const Route$o = createFileRoute("/wardrobe")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import('./settings-CiaIqzM7.mjs');
const Route$n = createFileRoute("/settings")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import('./profile-DvW6ivNf.mjs');
const Route$m = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import('./outfits-utN9StXh.mjs');
const Route$l = createFileRoute("/outfits")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import('./notifications-CTRCJ02L.mjs');
const Route$k = createFileRoute("/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import('./discover-B9zYjl-E.mjs');
const Route$j = createFileRoute("/discover")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import('./calendar-D13dLD_k.mjs');
const Route$i = createFileRoute("/calendar")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import('./index-nGD4nXRg.mjs');
const Route$h = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import('./index-D5mqFFPu.mjs');
const Route$g = createFileRoute("/trends/")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import('./index-bPbinRAv.mjs');
const Route$f = createFileRoute("/settings/")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import('./index-BwYfntZ1.mjs');
const Route$e = createFileRoute("/outfits/")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import('./_trendId-DOEImn7d.mjs');
const Route$d = createFileRoute("/trends/$trendId")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import('./privacy-DPX4yY0I.mjs');
const Route$c = createFileRoute("/settings/privacy")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import('./notifications-B_cqHQk0.mjs');
const Route$b = createFileRoute("/settings/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import('./data-4LdL3V6U.mjs');
const Route$a = createFileRoute("/settings/data")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import('./ai-DEVW8n11.mjs');
const Route$9 = createFileRoute("/settings/ai")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import('./about-o2CEhk-d.mjs');
const Route$8 = createFileRoute("/settings/about")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import('./new-HBYuS551.mjs');
const Route$7 = createFileRoute("/profiles/new")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import('./new-D7p17cBp.mjs');
const Route$6 = createFileRoute("/outfits/new")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import('./_outfitId-BkA760io.mjs');
const Route$5 = createFileRoute("/outfits/$outfitId")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import('./new-IiPr_tCJ.mjs');
const Route$4 = createFileRoute("/items/new")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import('./_itemId-DMh-fXUr.mjs');
const Route$3 = createFileRoute("/items/$itemId")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import('./_guideId-CmT51oUs.mjs');
const Route$2 = createFileRoute("/guides/$guideId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import('./_articleId-DvUW5fnm.mjs');
const Route$1 = createFileRoute("/articles/$articleId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import('./_outfitId_.edit-B4qvcwv9.mjs');
const Route = createFileRoute("/outfits/$outfitId_/edit")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WardrobeRoute = Route$o.update({
  id: "/wardrobe",
  path: "/wardrobe",
  getParentRoute: () => Route$p
});
const SettingsRoute = Route$n.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$p
});
const ProfileRoute = Route$m.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$p
});
const OutfitsRoute = Route$l.update({
  id: "/outfits",
  path: "/outfits",
  getParentRoute: () => Route$p
});
const NotificationsRoute = Route$k.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$p
});
const DiscoverRoute = Route$j.update({
  id: "/discover",
  path: "/discover",
  getParentRoute: () => Route$p
});
const CalendarRoute = Route$i.update({
  id: "/calendar",
  path: "/calendar",
  getParentRoute: () => Route$p
});
const IndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$p
});
const TrendsIndexRoute = Route$g.update({
  id: "/trends/",
  path: "/trends/",
  getParentRoute: () => Route$p
});
const SettingsIndexRoute = Route$f.update({
  id: "/",
  path: "/",
  getParentRoute: () => SettingsRoute
});
const OutfitsIndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => OutfitsRoute
});
const TrendsTrendIdRoute = Route$d.update({
  id: "/trends/$trendId",
  path: "/trends/$trendId",
  getParentRoute: () => Route$p
});
const SettingsPrivacyRoute = Route$c.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => SettingsRoute
});
const SettingsNotificationsRoute = Route$b.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => SettingsRoute
});
const SettingsDataRoute = Route$a.update({
  id: "/data",
  path: "/data",
  getParentRoute: () => SettingsRoute
});
const SettingsAiRoute = Route$9.update({
  id: "/ai",
  path: "/ai",
  getParentRoute: () => SettingsRoute
});
const SettingsAboutRoute = Route$8.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => SettingsRoute
});
const ProfilesNewRoute = Route$7.update({
  id: "/profiles/new",
  path: "/profiles/new",
  getParentRoute: () => Route$p
});
const OutfitsNewRoute = Route$6.update({
  id: "/new",
  path: "/new",
  getParentRoute: () => OutfitsRoute
});
const OutfitsOutfitIdRoute = Route$5.update({
  id: "/$outfitId",
  path: "/$outfitId",
  getParentRoute: () => OutfitsRoute
});
const ItemsNewRoute = Route$4.update({
  id: "/items/new",
  path: "/items/new",
  getParentRoute: () => Route$p
});
const ItemsItemIdRoute = Route$3.update({
  id: "/items/$itemId",
  path: "/items/$itemId",
  getParentRoute: () => Route$p
});
const GuidesGuideIdRoute = Route$2.update({
  id: "/guides/$guideId",
  path: "/guides/$guideId",
  getParentRoute: () => Route$p
});
const ArticlesArticleIdRoute = Route$1.update({
  id: "/articles/$articleId",
  path: "/articles/$articleId",
  getParentRoute: () => Route$p
});
const OutfitsOutfitIdEditRoute = Route.update({
  id: "/$outfitId_/edit",
  path: "/$outfitId/edit",
  getParentRoute: () => OutfitsRoute
});
const OutfitsRouteChildren = {
  OutfitsOutfitIdRoute,
  OutfitsNewRoute,
  OutfitsIndexRoute,
  OutfitsOutfitIdEditRoute
};
const OutfitsRouteWithChildren = OutfitsRoute._addFileChildren(OutfitsRouteChildren);
const SettingsRouteChildren = {
  SettingsAboutRoute,
  SettingsAiRoute,
  SettingsDataRoute,
  SettingsNotificationsRoute,
  SettingsPrivacyRoute,
  SettingsIndexRoute
};
const SettingsRouteWithChildren = SettingsRoute._addFileChildren(
  SettingsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  CalendarRoute,
  DiscoverRoute,
  NotificationsRoute,
  OutfitsRoute: OutfitsRouteWithChildren,
  ProfileRoute,
  SettingsRoute: SettingsRouteWithChildren,
  WardrobeRoute,
  ArticlesArticleIdRoute,
  GuidesGuideIdRoute,
  ItemsItemIdRoute,
  ItemsNewRoute,
  ProfilesNewRoute,
  TrendsTrendIdRoute,
  TrendsIndexRoute
};
const routeTree = Route$p._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));

export { Route$d as R, useTheme as a, Route$5 as b, Route$3 as c, Route$2 as d, Route$1 as e, Route as f, getDatabase as g, router as r, useProfile as u };
//# sourceMappingURL=router-h1SIfdX4.mjs.map
