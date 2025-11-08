import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { g as getDatabase } from './router-h1SIfdX4.mjs';

function useRxQuery(queryKey, queryFn, subscribe) {
  const [, setTrigger] = useState(0);
  const queryClient = useQueryClient();
  useEffect(() => {
    let unsubscribe;
    const setupSubscription = async () => {
      try {
        unsubscribe = subscribe(() => {
          queryClient.invalidateQueries({ queryKey });
          setTrigger((prev) => prev + 1);
        });
      } catch (error) {
        console.error("Failed to setup subscription:", error);
      }
    };
    setupSubscription();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryKey.join(","), queryClient]);
  return useQuery({
    queryKey,
    queryFn,
    retry: 3,
    retryDelay: 1e3
  });
}
function useProfiles() {
  return useRxQuery(
    ["profiles"],
    async () => {
      try {
        const db = await getDatabase();
        const profiles = await db.profiles.find().exec();
        const result = profiles.map((doc) => doc.toJSON());
        console.log("\u2705 Loaded profiles:", result.length);
        return result;
      } catch (error) {
        console.error("\u274C Failed to load profiles:", error);
        throw error;
      }
    },
    (callback) => {
      let subscription;
      getDatabase().then((db) => {
        subscription = db.profiles.find().$.subscribe(() => {
          console.log("\u{1F504} Profiles changed, triggering update");
          callback();
        });
      }).catch((err) => console.error("Failed to setup profiles subscription:", err));
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  );
}
function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const db = await getDatabase();
      const now = Date.now();
      const id = `profile_${now}_${Math.random().toString(36).slice(2)}`;
      const profile = await db.profiles.insert({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return profile.toJSON();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    }
  });
}
function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const db = await getDatabase();
      const profile = await db.profiles.findOne(id).exec();
      if (!profile) {
        throw new Error("Profile not found");
      }
      await profile.remove();
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    }
  });
}
function useResetProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId) => {
      const db = await getDatabase();
      console.log(`\u{1F504} Resetting profile ${profileId}...`);
      const outfits = await db.outfits.find({ selector: { profileId } }).exec();
      const outfitIds = outfits.map((outfit) => outfit.id);
      console.log(`  Found ${outfitIds.length} outfits to remove`);
      if (outfitIds.length > 0) {
        const calendarEntries = await db.calendar_entries.find({
          selector: {
            outfitId: { $in: outfitIds }
          }
        }).exec();
        console.log(`  Found ${calendarEntries.length} calendar entries to remove`);
        for (const entry of calendarEntries) {
          await entry.remove();
        }
      }
      for (const outfit of outfits) {
        await outfit.remove();
      }
      const items = await db.items.find({ selector: { profileId } }).exec();
      console.log(`  Found ${items.length} items to remove`);
      for (const item of items) {
        await item.remove();
      }
      console.log(`\u2705 Profile ${profileId} reset complete`);
      return profileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
      queryClient.invalidateQueries({ queryKey: ["calendar_entries"] });
    }
  });
}
function useItems(profileId) {
  return useRxQuery(
    profileId ? ["items", "profile", profileId] : ["items"],
    async () => {
      try {
        const db = await getDatabase();
        const query = profileId ? db.items.find({ selector: { profileId } }) : db.items.find();
        const items = await query.exec();
        const result = items.map((doc) => doc.toJSON());
        console.log("\u2705 Loaded items:", result.length, profileId ? `for profile ${profileId}` : "");
        return result;
      } catch (error) {
        console.error("\u274C Failed to load items:", error);
        throw error;
      }
    },
    (callback) => {
      let subscription;
      getDatabase().then((db) => {
        const query = profileId ? db.items.find({ selector: { profileId } }) : db.items.find();
        subscription = query.$.subscribe(() => {
          console.log("\u{1F504} Items changed, triggering update");
          callback();
        });
      }).catch((err) => console.error("Failed to setup items subscription:", err));
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  );
}
function useItem(id) {
  return useRxQuery(
    ["items", id],
    async () => {
      const db = await getDatabase();
      const item = await db.items.findOne(id).exec();
      return item ? item.toJSON() : null;
    },
    (callback) => {
      let subscription;
      getDatabase().then((db) => {
        subscription = db.items.findOne(id).$.subscribe(() => callback());
      });
      return () => subscription?.unsubscribe();
    }
  );
}
function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const db = await getDatabase();
      const now = Date.now();
      const id = `item_${now}_${Math.random().toString(36).slice(2)}`;
      const item = await db.items.insert({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return item.toJSON();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
}
function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const db = await getDatabase();
      const item = await db.items.findOne(id).exec();
      if (!item) {
        throw new Error("Item not found");
      }
      await item.update({
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      });
      return item.toJSON();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["items", variables.id] });
    }
  });
}
function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const db = await getDatabase();
      const item = await db.items.findOne(id).exec();
      if (!item) {
        throw new Error("Item not found");
      }
      await item.remove();
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
    }
  });
}
function useOutfits(profileId) {
  return useRxQuery(
    profileId ? ["outfits", "profile", profileId] : ["outfits"],
    async () => {
      const db = await getDatabase();
      const query = profileId ? db.outfits.find({ selector: { profileId } }) : db.outfits.find();
      const outfits = await query.exec();
      return outfits.map((doc) => doc.toJSON());
    },
    (callback) => {
      let subscription;
      getDatabase().then((db) => {
        const query = profileId ? db.outfits.find({ selector: { profileId } }) : db.outfits.find();
        subscription = query.$.subscribe(() => callback());
      });
      return () => subscription?.unsubscribe();
    }
  );
}
function useOutfit(id) {
  return useRxQuery(
    ["outfits", id],
    async () => {
      const db = await getDatabase();
      const outfit = await db.outfits.findOne(id).exec();
      return outfit ? outfit.toJSON() : null;
    },
    (callback) => {
      let subscription;
      getDatabase().then((db) => {
        subscription = db.outfits.findOne(id).$.subscribe(() => callback());
      });
      return () => subscription?.unsubscribe();
    }
  );
}
function useOutfitWithItems(id) {
  const outfitQuery = useOutfit(id);
  const itemsQuery = useItems(outfitQuery.data?.profileId);
  return {
    ...outfitQuery,
    data: outfitQuery.data && itemsQuery.data ? {
      ...outfitQuery.data,
      items: outfitQuery.data.itemIds.map((itemId) => itemsQuery.data?.find((item) => item.id === itemId)).filter((item) => item !== void 0)
    } : null
  };
}
function useCreateOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const db = await getDatabase();
      const now = Date.now();
      const id = `outfit_${now}_${Math.random().toString(36).slice(2)}`;
      const outfit = await db.outfits.insert({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return outfit.toJSON();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
    }
  });
}
function useUpdateOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const db = await getDatabase();
      const outfit = await db.outfits.findOne(id).exec();
      if (!outfit) {
        throw new Error("Outfit not found");
      }
      await outfit.update({
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      });
      return outfit.toJSON();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
      queryClient.invalidateQueries({ queryKey: ["outfits", variables.id] });
    }
  });
}
function useDeleteOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const db = await getDatabase();
      const outfit = await db.outfits.findOne(id).exec();
      if (!outfit) {
        throw new Error("Outfit not found");
      }
      await outfit.remove();
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outfits"] });
      queryClient.invalidateQueries({ queryKey: ["calendar_entries"] });
    }
  });
}
function useCalendarEntries() {
  return useRxQuery(
    ["calendar_entries"],
    async () => {
      const db = await getDatabase();
      const entries = await db.calendar_entries.find().exec();
      return entries.map((doc) => doc.toJSON());
    },
    (callback) => {
      let subscription;
      getDatabase().then((db) => {
        subscription = db.calendar_entries.find().$.subscribe(() => callback());
      });
      return () => subscription?.unsubscribe();
    }
  );
}

export { useProfiles as a, useDeleteProfile as b, useOutfits as c, useCalendarEntries as d, useResetProfile as e, useCreateProfile as f, useCreateOutfit as g, useOutfitWithItems as h, useDeleteOutfit as i, useCreateItem as j, useUpdateItem as k, useDeleteItem as l, useItem as m, useUpdateOutfit as n, useItems as u };
//# sourceMappingURL=useData-Ya3GAmCM.mjs.map
