import type { AuraDatabase } from '@/types'

// Dynamic imports will be used to prevent server-side execution

// RxDB Schemas
const profileSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    },
    isDefault: {
      type: 'boolean'
    },
    avatar: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    createdAt: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    }
  },
  required: ['id', 'name', 'isDefault', 'createdAt', 'updatedAt']
} as const

const itemSchema = {
  version: 2,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    },
    category: {
      type: 'string'
    },
    hasPhoto: {
      type: 'boolean'
    },
    photo: {
      type: 'string'
    },
    color: {
      type: 'string'
    },
    size: {
      type: 'string'
    },
    brand: {
      type: 'string'
    },
    tags: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    profileId: {
      type: 'string'
    },
    createdAt: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    }
  },
  required: ['id', 'name', 'category', 'hasPhoto', 'profileId', 'createdAt', 'updatedAt']
} as const

const outfitSchema = {
  version: 1,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string'
    },
    season: {
      type: 'string'
    },
    occasion: {
      type: 'string'
    },
    weather: {
      type: 'string'
    },
    tags: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    itemIds: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    profileId: {
      type: 'string'
    },
    createdAt: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    }
  },
  required: ['id', 'name', 'season', 'itemIds', 'profileId', 'createdAt', 'updatedAt']
} as const

const calendarEntrySchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    date: {
      type: 'string'
    },
    outfitId: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    createdAt: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    }
  },
  required: ['id', 'date', 'createdAt', 'updatedAt']
} as const

// Initialize Database
let dbPromise: Promise<AuraDatabase> | null = null

// Helper function to clear old database if needed
async function clearOldDatabase() {
  try {
    // Clear IndexedDB
    if (typeof window !== 'undefined' && window.indexedDB) {
      // Try to delete old database names
      const oldNames = ['aura_wardrobe_db', 'rxdb-dexie-aura_wardrobe_db']
      for (const name of oldNames) {
        try {
          await window.indexedDB.deleteDatabase(name)
          console.log(`🗑️  Cleared old database: ${name}`)
        } catch (e) {
          // Ignore errors, database might not exist
        }
      }
    }
  } catch (error) {
    console.warn('Could not clear old databases:', error)
  }
}

export async function initDatabase(): Promise<AuraDatabase> {
  if (dbPromise) {
    return dbPromise
  }

  dbPromise = (async () => {
    try {
      console.log('🔧 Initializing RxDB database...')

      // Dynamically import RxDB modules (only in browser)
      const { createRxDatabase, addRxPlugin } = await import('rxdb')
      const { getRxStorageDexie } = await import('rxdb/plugins/storage-dexie')
      const { RxDBMigrationSchemaPlugin } = await import('rxdb/plugins/migration-schema')

      // Add migration plugin
      addRxPlugin(RxDBMigrationSchemaPlugin)

      // Add dev-mode plugin in development
      if (import.meta.env.DEV) {
        const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode')
        addRxPlugin(RxDBDevModePlugin)
      }

      // Wrap storage with validation in dev mode
      let storage
      if (import.meta.env.DEV) {
        const { wrappedValidateAjvStorage } = await import('rxdb/plugins/validate-ajv')
        storage = wrappedValidateAjvStorage({ storage: getRxStorageDexie() })
      } else {
        storage = getRxStorageDexie()
      }

      const db = await createRxDatabase<AuraDatabase>({
        name: 'aurawardrobedb',
        storage,
        multiInstance: false,
        ignoreDuplicate: true
      })

      console.log('✅ Database created successfully')

      // Add collections
      console.log('📦 Adding collections...')

      // First add profiles collection
      await db.addCollections({
        profiles: {
          schema: profileSchema
        }
      })

      // Ensure default profile exists before migrations
      const profilesCollection = db.profiles
      let defaultProfile = await profilesCollection.findOne({ selector: { isDefault: true } }).exec()

      if (!defaultProfile) {
        console.log('📝 Creating default profile...')
        const now = Date.now()
        defaultProfile = await profilesCollection.insert({
          id: `profile_${now}_default`,
          name: 'My Wardrobe',
          isDefault: true,
          createdAt: now,
          updatedAt: now
        })
        console.log('✅ Default profile created:', defaultProfile.id)
      }

      const defaultProfileId = defaultProfile.id

      // Now add other collections with migrations
      await db.addCollections({
        items: {
          schema: itemSchema,
          migrationStrategies: {
            1: (oldDoc: any) => {
              // Migration from version 0 to 1: add photo field
              return {
                ...oldDoc,
                photo: ''
              }
            },
            2: (oldDoc: any) => {
              // Migration from version 1 to 2: add profileId field
              return {
                ...oldDoc,
                profileId: defaultProfileId
              }
            }
          }
        },
        outfits: {
          schema: outfitSchema,
          migrationStrategies: {
            1: (oldDoc: any) => {
              // Migration from version 0 to 1: add profileId field
              return {
                ...oldDoc,
                profileId: defaultProfileId
              }
            }
          }
        },
        calendar_entries: {
          schema: calendarEntrySchema
        }
      })

      console.log('✅ Collections added successfully')
      console.log('✨ Clean wardrobe initialized - ready for new creations!')

      return db
    } catch (error) {
      console.error('❌ Failed to initialize database:', error)
      throw error
    }
  })()

  return dbPromise
}

// Get database instance
export async function getDatabase(): Promise<AuraDatabase> {
  // Prevent database initialization on server-side
  if (typeof window === 'undefined') {
    throw new Error('Database can only be accessed in the browser')
  }
  return initDatabase()
}

// Clear all data from the database (useful for fresh start)
export async function clearAllData() {
  try {
    const db = await getDatabase()

    // Remove all items
    const items = await db.items.find().exec()
    await Promise.all(items.map(item => item.remove()))

    // Remove all outfits
    const outfits = await db.outfits.find().exec()
    await Promise.all(outfits.map(outfit => outfit.remove()))

    // Remove all calendar entries
    const entries = await db.calendar_entries.find().exec()
    await Promise.all(entries.map(entry => entry.remove()))

    // Remove all profiles
    const profiles = await db.profiles.find().exec()
    await Promise.all(profiles.map(profile => profile.remove()))

    console.log('🧹 All data cleared successfully')
  } catch (error) {
    console.error('Failed to clear data:', error)
    throw error
  }
}

// Export the clear function for manual cleanup if needed
export { clearOldDatabase }
