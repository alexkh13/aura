import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getDatabase } from '@/db'
import type { Item, Outfit, CalendarEntry, Profile } from '@/types'

// Reactive RxDB query hook
function useRxQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  subscribe: (callback: () => void) => (() => void) | undefined
) {
  const [, setTrigger] = useState(0)
  const queryClient = useQueryClient()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupSubscription = async () => {
      try {
        unsubscribe = subscribe(() => {
          queryClient.invalidateQueries({ queryKey })
          setTrigger(prev => prev + 1)
        })
      } catch (error) {
        console.error('Failed to setup subscription:', error)
      }
    }

    setupSubscription()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [queryKey.join(','), queryClient])

  return useQuery({
    queryKey,
    queryFn,
    retry: 3,
    retryDelay: 1000
  })
}

// ==================== PROFILES ====================

export function useProfiles() {
  return useRxQuery<Profile[]>(
    ['profiles'],
    async () => {
      try {
        const db = await getDatabase()
        const profiles = await db.profiles.find().exec()
        const result = profiles.map(doc => doc.toJSON())
        console.log('✅ Loaded profiles:', result.length)
        return result
      } catch (error) {
        console.error('❌ Failed to load profiles:', error)
        throw error
      }
    },
    (callback) => {
      let subscription: any
      getDatabase()
        .then(db => {
          subscription = db.profiles.find().$.subscribe(() => {
            console.log('🔄 Profiles changed, triggering update')
            callback()
          })
        })
        .catch(err => console.error('Failed to setup profiles subscription:', err))
      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    }
  )
}

export function useProfile(id: string) {
  return useRxQuery<Profile | null>(
    ['profiles', id],
    async () => {
      const db = await getDatabase()
      const profile = await db.profiles.findOne(id).exec()
      return profile ? profile.toJSON() : null
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        subscription = db.profiles.findOne(id).$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useDefaultProfile() {
  return useRxQuery<Profile | null>(
    ['profiles', 'default'],
    async () => {
      const db = await getDatabase()
      const profile = await db.profiles.findOne({ selector: { isDefault: true } }).exec()
      return profile ? profile.toJSON() : null
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        subscription = db.profiles.find({ selector: { isDefault: true } }).$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => {
      const db = await getDatabase()
      const now = Date.now()
      const id = `profile_${now}_${Math.random().toString(36).slice(2)}`

      const profile = await db.profiles.insert({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      })

      return profile.toJSON()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    }
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Profile> }) => {
      const db = await getDatabase()
      const profile = await db.profiles.findOne(id).exec()

      if (!profile) {
        throw new Error('Profile not found')
      }

      await profile.update({
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      })

      return profile.toJSON()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      queryClient.invalidateQueries({ queryKey: ['profiles', variables.id] })
    }
  })
}

export function useDeleteProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const db = await getDatabase()
      const profile = await db.profiles.findOne(id).exec()

      if (!profile) {
        throw new Error('Profile not found')
      }

      await profile.remove()
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    }
  })
}

export function useResetProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileId: string) => {
      const db = await getDatabase()

      console.log(`🔄 Resetting profile ${profileId}...`)

      // Step 1: Get all outfit IDs for this profile (to clean up calendar entries)
      const outfits = await db.outfits.find({ selector: { profileId } }).exec()
      const outfitIds = outfits.map(outfit => outfit.id)
      console.log(`  Found ${outfitIds.length} outfits to remove`)

      // Step 2: Delete all calendar entries that reference these outfits
      if (outfitIds.length > 0) {
        const calendarEntries = await db.calendar_entries
          .find({
            selector: {
              outfitId: { $in: outfitIds }
            }
          })
          .exec()

        console.log(`  Found ${calendarEntries.length} calendar entries to remove`)

        for (const entry of calendarEntries) {
          await entry.remove()
        }
      }

      // Step 3: Delete all outfits for this profile
      for (const outfit of outfits) {
        await outfit.remove()
      }

      // Step 4: Delete all items for this profile
      const items = await db.items.find({ selector: { profileId } }).exec()
      console.log(`  Found ${items.length} items to remove`)

      for (const item of items) {
        await item.remove()
      }

      console.log(`✅ Profile ${profileId} reset complete`)
      return profileId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
      queryClient.invalidateQueries({ queryKey: ['calendar_entries'] })
    }
  })
}

// ==================== ITEMS ====================

export function useItems(profileId?: string) {
  return useRxQuery<Item[]>(
    profileId ? ['items', 'profile', profileId] : ['items'],
    async () => {
      try {
        const db = await getDatabase()
        const query = profileId
          ? db.items.find({ selector: { profileId } })
          : db.items.find()
        const items = await query.exec()
        const result = items.map(doc => doc.toJSON())
        console.log('✅ Loaded items:', result.length, profileId ? `for profile ${profileId}` : '')
        return result
      } catch (error) {
        console.error('❌ Failed to load items:', error)
        throw error
      }
    },
    (callback) => {
      let subscription: any
      getDatabase()
        .then(db => {
          const query = profileId
            ? db.items.find({ selector: { profileId } })
            : db.items.find()
          subscription = query.$.subscribe(() => {
            console.log('🔄 Items changed, triggering update')
            callback()
          })
        })
        .catch(err => console.error('Failed to setup items subscription:', err))
      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    }
  )
}

export function useItem(id: string) {
  return useRxQuery<Item | null>(
    ['items', id],
    async () => {
      const db = await getDatabase()
      const item = await db.items.findOne(id).exec()
      return item ? item.toJSON() : null
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        subscription = db.items.findOne(id).$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useCreateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
      const db = await getDatabase()
      const now = Date.now()
      const id = `item_${now}_${Math.random().toString(36).slice(2)}`

      const item = await db.items.insert({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      })

      return item.toJSON()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    }
  })
}

export function useUpdateItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Item> }) => {
      const db = await getDatabase()
      const item = await db.items.findOne(id).exec()

      if (!item) {
        throw new Error('Item not found')
      }

      await item.update({
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      })

      return item.toJSON()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['items', variables.id] })
    }
  })
}

export function useDeleteItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const db = await getDatabase()
      const item = await db.items.findOne(id).exec()

      if (!item) {
        throw new Error('Item not found')
      }

      await item.remove()
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
    }
  })
}

// ==================== OUTFITS ====================

export function useOutfits(profileId?: string) {
  return useRxQuery<Outfit[]>(
    profileId ? ['outfits', 'profile', profileId] : ['outfits'],
    async () => {
      const db = await getDatabase()
      const query = profileId
        ? db.outfits.find({ selector: { profileId } })
        : db.outfits.find()
      const outfits = await query.exec()
      return outfits.map(doc => doc.toJSON())
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        const query = profileId
          ? db.outfits.find({ selector: { profileId } })
          : db.outfits.find()
        subscription = query.$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useOutfit(id: string) {
  return useRxQuery<Outfit | null>(
    ['outfits', id],
    async () => {
      const db = await getDatabase()
      const outfit = await db.outfits.findOne(id).exec()
      return outfit ? outfit.toJSON() : null
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        subscription = db.outfits.findOne(id).$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useOutfitWithItems(id: string) {
  const outfitQuery = useOutfit(id)
  const itemsQuery = useItems(outfitQuery.data?.profileId)

  return {
    ...outfitQuery,
    data: outfitQuery.data && itemsQuery.data
      ? {
          ...outfitQuery.data,
          items: outfitQuery.data.itemIds
            .map(itemId => itemsQuery.data?.find(item => item.id === itemId))
            .filter((item): item is Item => item !== undefined)
        }
      : null
  }
}

export function useCreateOutfit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>) => {
      const db = await getDatabase()
      const now = Date.now()
      const id = `outfit_${now}_${Math.random().toString(36).slice(2)}`

      const outfit = await db.outfits.insert({
        id,
        ...data,
        createdAt: now,
        updatedAt: now
      })

      return outfit.toJSON()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
    }
  })
}

export function useUpdateOutfit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Outfit> }) => {
      const db = await getDatabase()
      const outfit = await db.outfits.findOne(id).exec()

      if (!outfit) {
        throw new Error('Outfit not found')
      }

      await outfit.update({
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      })

      return outfit.toJSON()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
      queryClient.invalidateQueries({ queryKey: ['outfits', variables.id] })
    }
  })
}

export function useDeleteOutfit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const db = await getDatabase()
      const outfit = await db.outfits.findOne(id).exec()

      if (!outfit) {
        throw new Error('Outfit not found')
      }

      await outfit.remove()
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outfits'] })
      queryClient.invalidateQueries({ queryKey: ['calendar_entries'] })
    }
  })
}

// ==================== CALENDAR ENTRIES ====================

export function useCalendarEntries() {
  return useRxQuery<CalendarEntry[]>(
    ['calendar_entries'],
    async () => {
      const db = await getDatabase()
      const entries = await db.calendar_entries.find().exec()
      return entries.map(doc => doc.toJSON())
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        subscription = db.calendar_entries.find().$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useCalendarEntry(date: string) {
  return useRxQuery<CalendarEntry | null>(
    ['calendar_entries', date],
    async () => {
      const db = await getDatabase()
      const entry = await db.calendar_entries.findOne(date).exec()
      return entry ? entry.toJSON() : null
    },
    (callback) => {
      let subscription: any
      getDatabase().then(db => {
        subscription = db.calendar_entries.findOne(date).$.subscribe(() => callback())
      })
      return () => subscription?.unsubscribe()
    }
  )
}

export function useCreateCalendarEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<CalendarEntry, 'createdAt' | 'updatedAt'>) => {
      const db = await getDatabase()
      const now = Date.now()

      const entry = await db.calendar_entries.insert({
        ...data,
        createdAt: now,
        updatedAt: now
      })

      return entry.toJSON()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar_entries'] })
    }
  })
}

export function useUpdateCalendarEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CalendarEntry> }) => {
      const db = await getDatabase()
      const entry = await db.calendar_entries.findOne(id).exec()

      if (!entry) {
        throw new Error('Calendar entry not found')
      }

      await entry.update({
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      })

      return entry.toJSON()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calendar_entries'] })
      queryClient.invalidateQueries({ queryKey: ['calendar_entries', variables.id] })
    }
  })
}

export function useDeleteCalendarEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const db = await getDatabase()
      const entry = await db.calendar_entries.findOne(id).exec()

      if (!entry) {
        throw new Error('Calendar entry not found')
      }

      await entry.remove()
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar_entries'] })
    }
  })
}
