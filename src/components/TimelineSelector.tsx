'use client';

import { useState, useRef, useCallback } from 'react';

interface TimelineSelectorProps {
  selectedDate: string;
  startTime: string;
  endTime: string;
  onTimeChange: (startTime: string, endTime: string) => void;
}

export default function TimelineSelector({
  selectedDate,
  startTime,
  endTime,
  onTimeChange
}: TimelineSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 時間を分に変換 (例: "09:30" -> 570)
  const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 分を時間に変換 (例: 570 -> "09:30")
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Y座標を時間（分）に変換
  const yToMinutes = (y: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const relativeY = y - rect.top;
    const totalHeight = rect.height;
    
    // 6:00から24:00まで（18時間 = 1080分）
    const startMinutes = 6 * 60; // 6:00 = 360分
    const endMinutes = 24 * 60; // 24:00 = 1440分
    const totalMinutes = endMinutes - startMinutes;
    
    const minutes = startMinutes + (relativeY / totalHeight) * totalMinutes;
    
    // 15分単位に丸める
    return Math.round(minutes / 15) * 15;
  };

  // 時間（分）をY座標に変換
  const minutesToY = (minutes: number): number => {
    if (!timelineRef.current) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    
    const startMinutes = 6 * 60;
    const endMinutes = 24 * 60;
    const totalMinutes = endMinutes - startMinutes;
    
    const relativeMinutes = minutes - startMinutes;
    return (relativeMinutes / totalMinutes) * rect.height;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const minutes = yToMinutes(e.clientY);
    setIsDragging(true);
    setDragStart(minutes);
    setDragEnd(minutes);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return;
    
    const minutes = yToMinutes(e.clientY);
    setDragEnd(minutes);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || dragStart === null || dragEnd === null) return;
    
    const start = Math.min(dragStart, dragEnd);
    const end = Math.max(dragStart, dragEnd);
    
    // 最低1時間の選択を保証
    const minDuration = 60; // 60分
    const duration = end - start;
    const finalEnd = duration < minDuration ? start + minDuration : end;
    
    onTimeChange(minutesToTime(start), minutesToTime(finalEnd));
    
    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  }, [isDragging, dragStart, dragEnd, onTimeChange]);

  // 現在の選択範囲を取得
  const getCurrentSelection = () => {
    if (isDragging && dragStart !== null && dragEnd !== null) {
      const start = Math.min(dragStart, dragEnd);
      const end = Math.max(dragStart, dragEnd);
      return { start, end };
    } else if (startTime && endTime) {
      return {
        start: timeToMinutes(startTime),
        end: timeToMinutes(endTime)
      };
    }
    return null;
  };

  const selection = getCurrentSelection();

  // 時間ラベルを生成 (6:00から24:00まで)
  const timeLabels = [];
  for (let hour = 6; hour <= 24; hour++) {
    timeLabels.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      minutes: hour * 60
    });
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">
        時間選択 - ドラッグしてシフト時間を選択してください
      </div>
      
      {selectedDate && (
        <div className="text-sm text-gray-600">
          対象日: {new Date(selectedDate).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          })}
        </div>
      )}

      <div className="relative bg-gray-50 rounded-lg p-4">
        <div className="flex">
          {/* 時間ラベル */}
          <div className="flex-shrink-0 w-16 relative">
            {timeLabels.map((label) => (
              <div
                key={label.time}
                className="absolute text-xs text-gray-500 -translate-y-2"
                style={{
                  top: `${((label.minutes - 6 * 60) / (18 * 60)) * 100}%`
                }}
              >
                {label.time}
              </div>
            ))}
          </div>

          {/* タイムライン */}
          <div className="flex-1 relative">
            <div
              ref={timelineRef}
              className="w-full h-96 bg-white border-2 border-gray-200 rounded cursor-crosshair relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (isDragging) handleMouseUp();
              }}
            >
              {/* 時間グリッド線 */}
              {timeLabels.map((label) => (
                <div
                  key={label.time}
                  className="absolute w-full border-t border-gray-100"
                  style={{
                    top: `${((label.minutes - 6 * 60) / (18 * 60)) * 100}%`
                  }}
                />
              ))}

              {/* 選択範囲 */}
              {selection && (
                <div
                  className="absolute w-full bg-indigo-200 border-2 border-indigo-400 rounded opacity-75"
                  style={{
                    top: `${((selection.start - 6 * 60) / (18 * 60)) * 100}%`,
                    height: `${((selection.end - selection.start) / (18 * 60)) * 100}%`
                  }}
                >
                  <div className="p-2 text-xs font-medium text-indigo-800">
                    {minutesToTime(selection.start)} - {minutesToTime(selection.end)}
                  </div>
                </div>
              )}

              {/* ドラッグ中のガイド */}
              {isDragging && (
                <div className="absolute inset-0 bg-indigo-50 bg-opacity-50 pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* 選択中の時間表示 */}
        {selection && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-md">
            <div className="text-sm font-medium text-indigo-900">
              選択中の時間: {minutesToTime(selection.start)} - {minutesToTime(selection.end)}
            </div>
            <div className="text-xs text-indigo-600 mt-1">
              時間: {Math.round((selection.end - selection.start) / 60 * 10) / 10}時間
            </div>
          </div>
        )}
      </div>

      {/* 手動入力オプション */}
      <div className="border-t pt-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          または手動で入力:
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">開始時刻</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => onTimeChange(e.target.value, endTime)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">終了時刻</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => onTimeChange(startTime, e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}