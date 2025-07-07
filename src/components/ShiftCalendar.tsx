'use client';

import { useState } from 'react';
import { AdminShiftSlot, FinalShift } from '@/types';

interface ShiftCalendarProps {
  adminSlots: AdminShiftSlot[];
  finalShifts: FinalShift[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

export default function ShiftCalendar({
  adminSlots,
  finalShifts,
  onDateSelect,
  selectedDate
}: ShiftCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
      days.push(new Date(day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getSlotCountForDate = (dateString: string) => {
    return adminSlots.filter(slot => slot.targetDate === dateString).length;
  };

  const getFinalShiftCountForDate = (dateString: string) => {
    return finalShifts.filter(shift => shift.workDate === dateString).length;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-4 border-b">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-md text-lg"
        >
          ←
        </button>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">{monthYear}</h2>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-md text-lg"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 sm:p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div
              key={day}
              className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {days.map((day) => {
            const dateString = getDateString(day);
            const slotCount = getSlotCountForDate(dateString);
            const finalShiftCount = getFinalShiftCountForDate(dateString);
            const isSelected = dateString === selectedDate;

            return (
              <button
                key={dateString}
                onClick={() => onDateSelect(dateString)}
                className={`
                  min-h-[40px] sm:min-h-[60px] p-0.5 sm:p-1 text-left rounded-md border transition-colors
                  ${isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isToday(day)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : isCurrentMonth(day)
                    ? 'hover:bg-gray-50 border-gray-200'
                    : 'text-gray-300 border-gray-100'
                  }
                `}
              >
                <div className="font-medium text-xs sm:text-sm">
                  {day.getDate()}
                </div>
                {slotCount > 0 && (
                  <div className="text-xs mt-0.5 sm:mt-1">
                    <div className={`px-0.5 sm:px-1 py-0.5 rounded text-xs ${
                      isSelected ? 'bg-white text-indigo-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      募集: {slotCount}
                    </div>
                  </div>
                )}
                {finalShiftCount > 0 && (
                  <div className="text-xs mt-0.5 sm:mt-1">
                    <div className={`px-0.5 sm:px-1 py-0.5 rounded text-xs ${
                      isSelected ? 'bg-white text-indigo-600' : 'bg-green-100 text-green-600'
                    }`}>
                      確定: {finalShiftCount}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}