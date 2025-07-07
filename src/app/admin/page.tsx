'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShiftSlot, StaffShiftWish, FinalShift } from '@/types';
import ShiftCalendar from '@/components/ShiftCalendar';
import TimelineSelector from '@/components/TimelineSelector';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [adminSlots, setAdminSlots] = useState<AdminShiftSlot[]>([]);
  const [wishes, setWishes] = useState<StaffShiftWish[]>([]);
  const [finalShifts, setFinalShifts] = useState<FinalShift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'manager') {
      router.push('/employee');
      return;
    }

    setUser(parsedUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch admin slots (use real API)
      const slotsResponse = await fetch('/api/admin/slots', { headers });
      const slotsData = await slotsResponse.json();
      if (slotsData.success) {
        setAdminSlots(slotsData.data);
      }

      // Fetch wishes for selected date (use real API)
      const wishesResponse = await fetch(`/api/admin/wishes?targetDate=${selectedDate}`, { headers });
      const wishesData = await wishesResponse.json();
      if (wishesData.success) {
        setWishes(wishesData.data);
      }

      // Fetch calendar data
      const startDate = new Date();
      startDate.setDate(1); // First day of current month
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2); // Next 2 months
      
      const calendarResponse = await fetch(
        `/api/calendar/view?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
        { headers }
      );
      const calendarData = await calendarResponse.json();
      if (calendarData.success) {
        setFinalShifts(calendarData.data.finalShifts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (slotData: Partial<AdminShiftSlot>) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slotData),
      });

      const data = await response.json();
      if (data.success) {
        alert('シフト枠が作成されました');
        fetchData(); // Refresh data
      } else {
        alert('エラーが発生しました: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating slot:', error);
      alert('ネットワークエラーが発生しました');
    }
  };

  const handleFinalizeShift = async (slotId: string, employeeId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/finalize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slotId, employeeId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('シフトが確定されました');
        fetchData(); // Refresh data
      } else {
        alert('エラーが発生しました: ' + data.error);
      }
    } catch (error) {
      console.error('Error finalizing shift:', error);
      alert('ネットワークエラーが発生しました');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">管理者ダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.name}さん
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* カレンダー */}
          <div className="mb-8">
            <ShiftCalendar
              adminSlots={adminSlots}
              finalShifts={finalShifts}
              onDateSelect={(date) => {
                setSelectedDate(date);
                // 選択された日付の希望も再取得
                const token = localStorage.getItem('token');
                if (token) {
                  fetch(`/api/admin/wishes?targetDate=${date}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) setWishes(data.data);
                  });
                }
              }}
              selectedDate={selectedDate}
            />
          </div>

          {/* シフト枠作成 - フル幅で表示 */}
          <div className="mb-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                シフト枠作成
              </h3>
              <CreateSlotForm onSubmit={handleCreateSlot} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* シフト確定 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  シフト確定
                </h3>
                <div className="mt-4">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      fetchData();
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="mt-4">
                  <ShiftFinalizationPanel
                    selectedDate={selectedDate}
                    adminSlots={adminSlots}
                    wishes={wishes}
                    onFinalizeShift={handleFinalizeShift}
                  />
                </div>
              </div>
            </div>

            {/* シフト枠一覧 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  作成済みシフト枠
                </h3>
                <div className="mt-4 max-h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {adminSlots.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        シフト枠がまだ作成されていません
                      </p>
                    ) : (
                      adminSlots
                        .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                        .map((slot) => (
                          <div key={slot.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {new Date(slot.targetDate).toLocaleDateString('ja-JP', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    weekday: 'short'
                                  })}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {slot.requiredPeople}人募集
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  募集中
                                </span>
                              </div>
                            </div>
                            {slot.notes && (
                              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {slot.notes}
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShiftFinalizationPanel({
  selectedDate,
  adminSlots,
  wishes,
  onFinalizeShift,
}: {
  selectedDate: string;
  adminSlots: AdminShiftSlot[];
  wishes: StaffShiftWish[];
  onFinalizeShift: (slotId: string, employeeId: string) => void;
}) {
  const slotsForDate = adminSlots.filter(slot => slot.targetDate === selectedDate);
  const wishesForDate = wishes.filter(wish => wish.targetDate === selectedDate);

  if (slotsForDate.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {selectedDate}の募集枠がありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slotsForDate.map((slot) => {
        const matchingWishes = wishesForDate.filter(wish => 
          wish.wishStartTime <= slot.startTime && wish.wishEndTime >= slot.endTime
        );

        return (
          <div key={slot.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">
                  {slot.startTime} - {slot.endTime}
                </h4>
                <p className="text-sm text-gray-600">
                  必要人数: {slot.requiredPeople}人
                </p>
                {slot.notes && (
                  <p className="text-sm text-gray-500 mt-1">{slot.notes}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs ${
                  matchingWishes.length >= slot.requiredPeople 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {matchingWishes.length}/{slot.requiredPeople}人
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">希望者一覧:</h5>
              {matchingWishes.length === 0 ? (
                <p className="text-sm text-gray-500">希望者がいません</p>
              ) : (
                <div className="grid gap-2">
                  {matchingWishes.map((wish) => (
                    <div key={wish.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{wish.employeeName}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {wish.wishStartTime} - {wish.wishEndTime}
                        </span>
                      </div>
                      <button
                        onClick={() => onFinalizeShift(slot.id, wish.employeeId)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        確定
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateSlotForm({ onSubmit }: { onSubmit: (data: Partial<AdminShiftSlot>) => void }) {
  const [formData, setFormData] = useState({
    targetDate: '',
    startTime: '',
    endTime: '',
    requiredPeople: 1,
    notes: '',
  });

  const handleTimeChange = (startTime: string, endTime: string) => {
    setFormData(prev => ({
      ...prev,
      startTime,
      endTime
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 入力検証
    if (!formData.targetDate || !formData.startTime || !formData.endTime) {
      alert('日付、開始時刻、終了時刻は必須です');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert('終了時刻は開始時刻より後にしてください');
      return;
    }

    if (formData.requiredPeople < 1 || formData.requiredPeople > 10) {
      alert('必要人数は1〜10人の範囲で入力してください');
      return;
    }

    // 過去の日付チェック
    const selectedDate = new Date(formData.targetDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('過去の日付は選択できません');
      return;
    }

    onSubmit(formData);
    setFormData({
      targetDate: '',
      startTime: '',
      endTime: '',
      requiredPeople: 1,
      notes: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">日付</label>
        <input
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>

      {/* タイムライン選択 */}
      <div>
        <TimelineSelector
          selectedDate={formData.targetDate}
          startTime={formData.startTime}
          endTime={formData.endTime}
          onTimeChange={handleTimeChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">必要人数</label>
        <input
          type="number"
          min="1"
          max="10"
          value={formData.requiredPeople}
          onChange={(e) => setFormData({ ...formData, requiredPeople: parseInt(e.target.value) })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">備考</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
      >
        シフト枠を作成
      </button>
    </form>
  );
}