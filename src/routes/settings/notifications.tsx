import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/settings/notifications')({ component: NotificationsPage })

interface NotificationSettings {
  dailyOutfitReminder: boolean
  reminderTime: string
  weatherAlerts: boolean
  wardrobeUpdates: boolean
}

function NotificationsPage() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyOutfitReminder: false,
    reminderTime: '08:00',
    weatherAlerts: false,
    wardrobeUpdates: true
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load notification settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  const updateSetting = <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <button
            onClick={() => navigate({ to: '/settings' })}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Notifications
          </button>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Daily Reminder */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2">
              Reminders
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Daily Outfit Reminder
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get reminded to plan your outfit
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('dailyOutfitReminder', !settings.dailyOutfitReminder)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.dailyOutfitReminder
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.dailyOutfitReminder ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {settings.dailyOutfitReminder && (
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Reminder Time
                    </label>
                    <input
                      type="time"
                      value={settings.reminderTime}
                      onChange={(e) => updateSetting('reminderTime', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-2">
              Updates
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Weather Alerts
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified about weather changes
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('weatherAlerts', !settings.weatherAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.weatherAlerts
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.weatherAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Wardrobe Updates
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notified when items need attention
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('wardrobeUpdates', !settings.wardrobeUpdates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.wardrobeUpdates
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.wardrobeUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Note */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Note:</span> Browser notifications require permission.
              Make sure to enable notifications in your browser settings for the best experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
