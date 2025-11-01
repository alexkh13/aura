import type { RxDocument, RxCollection, RxDatabase } from 'rxdb'

// Profile Entity
export interface Profile {
  id: string
  name: string
  isDefault: boolean
  avatar?: string // Base64 encoded image data or emoji
  description?: string
  createdAt: number
  updatedAt: number
}

export type ProfileDocument = RxDocument<Profile>
export type ProfileCollection = RxCollection<Profile>

// Item/Clothing Entity
export interface Item {
  id: string
  name: string
  category: string
  hasPhoto: boolean
  photo?: string // Base64 encoded image data
  color?: string
  size?: string
  brand?: string
  tags?: string
  notes?: string
  profileId: string // Reference to Profile ID
  createdAt: number
  updatedAt: number
}

export type ItemDocument = RxDocument<Item>
export type ItemCollection = RxCollection<Item>

// Outfit Entity
export interface Outfit {
  id: string
  name: string
  season: string
  occasion?: string
  weather?: string
  tags?: string
  notes?: string
  itemIds: string[] // References to Item IDs
  profileId: string // Reference to Profile ID
  createdAt: number
  updatedAt: number
}

export type OutfitDocument = RxDocument<Outfit>
export type OutfitCollection = RxCollection<Outfit>

// Calendar Entry Entity
export interface CalendarEntry {
  id: string // Format: YYYY-MM-DD
  date: string // ISO date string
  outfitId?: string // Reference to Outfit ID
  notes?: string
  createdAt: number
  updatedAt: number
}

export type CalendarEntryDocument = RxDocument<CalendarEntry>
export type CalendarEntryCollection = RxCollection<CalendarEntry>

// Database Collections
export interface AuraCollections {
  profiles: ProfileCollection
  items: ItemCollection
  outfits: OutfitCollection
  calendar_entries: CalendarEntryCollection
}

export type AuraDatabase = RxDatabase<AuraCollections>
