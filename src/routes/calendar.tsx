import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ChevronLeft, Shirt, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useCalendarEntries, useOutfits, useItems } from '@/hooks/useData'
import { OutfitThumbnail } from '@/components/OutfitThumbnail'

export const Route = createFileRoute('/calendar')({ component: CalendarPage })

function CalendarPage() {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null)

  const { data: calendarEntries } = useCalendarEntries()
  const { data: outfits } = useOutfits()
  const { data: items, isLoading: itemsLoading } = useItems()

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const days: Array<{ date: Date | null; dateStr: string | null }> = []

    // Add empty cells for days before the month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, dateStr: null })
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      days.push({ date, dateStr })
    }

    return days
  }, [currentDate])

  const selectedEntry = selectedDateStr
    ? calendarEntries?.find(entry => entry.id === selectedDateStr)
    : null

  const selectedOutfit = selectedEntry?.outfitId
    ? outfits?.find(outfit => outfit.id === selectedEntry.outfitId)
    : null

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-md mx-auto">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sticky top-16 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Calendar
            </button>
            <div className="flex items-center gap-3">
              <button onClick={goToPreviousMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] text-center">{monthName}</span>
              <button onClick={goToNextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Calendar Grid */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((item, idx) => {
                const hasEntry = item.dateStr && calendarEntries?.some(entry => entry.id === item.dateStr)
                const isSelected = selectedDateStr === item.dateStr
                const isToday = item.date &&
                  item.date.toDateString() === new Date().toDateString()

                return (
                  <div
                    key={idx}
                    onClick={() => item.dateStr && setSelectedDateStr(item.dateStr)}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium cursor-pointer relative
                      ${item.date ? 'hover:bg-blue-50 dark:hover:bg-blue-950' : ''}
                      ${isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}
                      ${isToday && !isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                    `}
                  >
                    {item.date?.getDate()}
                    {hasEntry && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                        <Shirt className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Day Detail View */}
          {selectedDateStr && (
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {new Date(selectedDateStr).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>

              {selectedOutfit ? (
                <div>
                  <Link to="/outfits/$outfitId" params={{ outfitId: selectedOutfit.id }}>
                    <div className="flex gap-4 mb-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                      <div className="flex-shrink-0">
                        <OutfitThumbnail
                          itemIds={selectedOutfit.itemIds}
                          items={items}
                          size="small"
                          loading={itemsLoading}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{selectedOutfit.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Season: {selectedOutfit.season}</p>
                        {selectedOutfit.occasion && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Occasion: {selectedOutfit.occasion}</p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {selectedEntry.notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{selectedEntry.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400">No outfit scheduled for this date</p>
                </div>
              )}

              <div className="flex gap-3">
                <Link
                  to="/outfits"
                  className="flex-1 py-2 px-4 bg-blue-600 dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors text-center"
                >
                  {selectedOutfit ? 'Change Outfit' : 'Add Outfit'}
                </Link>
                {selectedOutfit && (
                  <button
                    onClick={() => {
                      // TODO: Implement remove outfit functionality
                      alert('Remove outfit functionality coming soon!')
                    }}
                    className="flex-1 py-2 px-4 bg-white dark:bg-gray-800 border-2 border-red-600 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Remove Outfit
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
