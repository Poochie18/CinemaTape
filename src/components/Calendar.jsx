import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Calendar({ selectedDate, onSelectDate, watchedFilms }) {
  const { i18n } = useTranslation();
  const dateLocale = i18n.language === 'uk' ? uk : enUS;
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month (0 = Sunday, 1 = Monday, etc)
  const firstDayOfWeek = monthStart.getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday = 0

  // Add empty cells for days before month starts
  const leadingEmptyCells = Array(adjustedFirstDay).fill(null);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getFilmsForDate = (date) => {
    return watchedFilms.filter(film => 
      isSameDay(new Date(film.watchDate), date)
    );
  };

  const weekDays = i18n.language === 'uk' 
    ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 glass-hover rounded-lg"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <h2 className="text-xl sm:text-2xl font-bold capitalize">
          {format(currentMonth, 'LLLL yyyy', { locale: dateLocale })}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 glass-hover rounded-lg"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="glass rounded-xl p-3 sm:p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {leadingEmptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {daysInMonth.map((day) => {
            const filmsForDay = getFilmsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const hasFilms = filmsForDay.length > 0;

            return (
              <motion.button
                key={day.toString()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate(day)}
                className={`
                  aspect-square rounded-lg relative overflow-hidden
                  transition-all duration-200
                  ${isSelected 
                    ? 'bg-gray-700 shadow-lg' 
                    : hasFilms
                    ? 'bg-gray-800 border border-gray-600 hover:bg-gray-700'
                    : 'glass-hover'
                  }
                  ${isCurrentDay && !isSelected ? 'ring-2 ring-gray-500' : ''}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full p-1">
                  <span className={`text-sm md:text-base font-medium ${isSelected ? 'text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  
                  {hasFilms && (
                    <div className="flex flex-col gap-0.5 mt-1 items-center">
                      {/* First row - up to 4 dots */}
                      <div className="flex gap-0.5">
                        {filmsForDay.slice(0, 4).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      {/* Second row - remaining dots (5-8) */}
                      {filmsForDay.length > 4 && (
                        <div className="flex gap-0.5">
                          {filmsForDay.slice(4, 8).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
