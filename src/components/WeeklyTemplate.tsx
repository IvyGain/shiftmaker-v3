'use client';

import { useState, useEffect } from 'react';
import { AdminShiftSlot } from '@/types';
import { 
  generateWeeklyShifts, 
  getMonday, 
  isHoliday, 
  isWeekend,
  getShiftStatistics 
} from '@/lib/weekly-template';

// 週次スケジュールデータ（表示用に一部抜粋）- 将来の機能拡張用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WEEKLY_BASE_SCHEDULE_PREVIEW = {
  Monday: [
    {
      startTime: '09:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '平日基本シフト'
    },
    {
      startTime: '09:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Tuesday: [
    {
      startTime: '15:00',
      endTime: '19:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '夕方シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Wednesday: [
    {
      startTime: '15:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '夕方〜夜シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Thursday: [
    {
      startTime: '08:30',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '朝〜夕方シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Friday: [
    {
      startTime: '08:30',
      endTime: '13:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '朝〜昼シフト'
    },
    {
      startTime: '11:00',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: 'ランチタイム強化'
    },
    {
      startTime: '16:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: '夕方〜夜シフト強化'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '管理業務'
    }
  ],
  Saturday: [
    {
      startTime: '08:00',
      endTime: '13:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '土曜朝シフト'
    },
    {
      startTime: '10:00',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: '土曜昼間強化'
    },
    {
      startTime: '16:00',
      endTime: '21:00',
      role: 'パートナー',
      requiredPeople: 3,
      requiredSkills: ['カフェ業務'],
      notes: '土曜夕方ピーク'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '土曜管理業務'
    }
  ],
  Sunday: [
    {
      startTime: '08:00',
      endTime: '14:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '日曜朝〜昼シフト'
    },
    {
      startTime: '10:00',
      endTime: '16:00',
      role: 'パートナー',
      requiredPeople: 2,
      requiredSkills: ['カフェ業務'],
      notes: '日曜昼間強化'
    },
    {
      startTime: '15:00',
      endTime: '19:00',
      role: 'パートナー',
      requiredPeople: 1,
      requiredSkills: ['カフェ業務'],
      notes: '日曜夕方シフト'
    },
    {
      startTime: '10:00',
      endTime: '18:00',
      role: 'マネージャー',
      requiredPeople: 1,
      requiredSkills: ['マネジメント', 'カフェ業務'],
      notes: '日曜管理業務'
    }
  ]
};

interface WeeklyTemplateProps {
  onApplyTemplate: (slots: Partial<AdminShiftSlot>[]) => void;
}

export default function WeeklyTemplate({ onApplyTemplate }: WeeklyTemplateProps) {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [previewSlots, setPreviewSlots] = useState<Partial<AdminShiftSlot>[]>([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<{
    totalSlots: number;
    totalPeople: number;
    weekendSlots: number;
    averagePeoplePerSlot: number;
  } | null>(null);

  // 週選択時のプレビュー更新
  useEffect(() => {
    if (selectedWeek) {
      const weekDate = getMonday(new Date(selectedWeek));
      const slots = generateWeeklyShifts(weekDate);
      setPreviewSlots(slots);
      setStatistics(getShiftStatistics(slots));
    } else {
      setPreviewSlots([]);
      setStatistics(null);
    }
  }, [selectedWeek]);

  // テンプレート適用
  const handleApplyTemplate = async () => {
    if (previewSlots.length === 0) {
      alert('週を選択してください');
      return;
    }

    setLoading(true);
    try {
      await onApplyTemplate(previewSlots);
      alert(`${previewSlots.length}個のシフト枠が作成されました`);
      setSelectedWeek('');
      setPreviewSlots([]);
    } catch (error) {
      console.error('Template application failed:', error);
      alert('テンプレート適用に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 今週の月曜日を取得（デフォルト値用）
  const getThisMonday = () => {
    const today = new Date();
    const monday = getMonday(new Date(today));
    return monday.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
          📅 週次固定シフトテンプレート
        </h3>
        
        {/* 週選択 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            適用する週（月曜日を選択）
          </label>
          <input
            type="date"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            min={getThisMonday()}
            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            ※月曜日を選択すると、その週（月〜日）のシフト枠が一括作成されます
          </p>
        </div>

        {/* 統計情報 */}
        {statistics && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-900 mb-2">📊 週次シフト統計</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">総シフト枠:</span>
                <span className="ml-1 font-medium">{statistics.totalSlots}件</span>
              </div>
              <div>
                <span className="text-gray-600">必要人数:</span>
                <span className="ml-1 font-medium">{statistics.totalPeople}人</span>
              </div>
              <div>
                <span className="text-gray-600">土日枠:</span>
                <span className="ml-1 font-medium text-red-600">{statistics.weekendSlots}件</span>
              </div>
              <div>
                <span className="text-gray-600">平均人数:</span>
                <span className="ml-1 font-medium">{statistics.averagePeoplePerSlot}人/枠</span>
              </div>
            </div>
          </div>
        )}

        {/* プレビュー */}
        {previewSlots.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">
              📋 作成されるシフト枠プレビュー ({previewSlots.length}件)
            </h4>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">日付</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">時間</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">人数</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">備考</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewSlots.map((slot, index) => {
                    const date = new Date(slot.targetDate!);
                    const dayName = date.toLocaleDateString('ja-JP', { weekday: 'short' });
                    const isSpecialDay = isHoliday(slot.targetDate!) || isWeekend(slot.targetDate!);
                    
                    return (
                      <tr key={index} className={isSpecialDay ? 'bg-red-50' : ''}>
                        <td className="px-3 py-2 text-sm">
                          <div className={isSpecialDay ? 'text-red-600 font-medium' : ''}>
                            {slot.targetDate} ({dayName})
                            {isSpecialDay && <span className="ml-1 text-xs">[休日]</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {slot.requiredPeople}人
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {slot.notes}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 適用ボタン */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {previewSlots.length > 0 && (
              <>
                💡 土日・祝日は<span className="text-red-600 font-medium">赤色</span>で表示されます
              </>
            )}
          </div>
          <button
            onClick={handleApplyTemplate}
            disabled={previewSlots.length === 0 || loading}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              previewSlots.length === 0 || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {loading ? '作成中...' : `週次テンプレートを適用 (${previewSlots.length}件)`}
          </button>
        </div>

        {/* 説明 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h5 className="text-sm font-medium text-blue-900 mb-2">📖 週次固定シフトについて</h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• 毎週同じパターンのシフト枠を一括作成できます</li>
            <li>• 曜日ごとに最適化されたシフト時間と人数配置</li>
            <li>• 金曜日・土曜日は人数を増やして忙しい時間帯に対応</li>
            <li>• 祝日・休日も自動判定して視覚的に分かりやすく表示</li>
          </ul>
        </div>
      </div>
    </div>
  );
}