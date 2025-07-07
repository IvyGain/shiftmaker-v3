'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShiftSlot, FinalShift } from '@/types';

export default function EmployeePage() {
  const [user, setUser] = useState<any>(null);
  const [adminSlots, setAdminSlots] = useState<AdminShiftSlot[]>([]);
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
    if (parsedUser.role !== 'employee') {
      router.push('/admin');
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

      // Get start and end date for the week
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 6);

      // Fetch calendar data (use mock for development)
      const calendarResponse = await fetch(
        `/api/calendar/view-mock?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
        { headers }
      );
      const calendarData = await calendarResponse.json();
      
      if (calendarData.success) {
        setAdminSlots(calendarData.data.adminSlots);
        setFinalShifts(calendarData.data.finalShifts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWish = async (slotId: string, startTime: string, endTime: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/wishes-mock', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetDate: selectedDate,
          wishStartTime: startTime,
          wishEndTime: endTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('希望シフトを提出しました');
        fetchData(); // Refresh data
      } else {
        alert('エラーが発生しました: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting wish:', error);
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
              <h1 className="text-xl font-semibold">従業員ダッシュボード</h1>
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
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">日付選択</h2>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* 希望シフト提出 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  希望シフト提出
                </h3>
                <div className="mt-4">
                  <ShiftWishForm
                    selectedDate={selectedDate}
                    onSubmit={handleSubmitWish}
                  />
                </div>
              </div>
            </div>

            {/* 利用可能なシフト枠 */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  利用可能なシフト枠
                </h3>
                <div className="mt-4">
                  <AvailableShiftsPanel
                    selectedDate={selectedDate}
                    adminSlots={adminSlots}
                    onSelectSlot={handleSubmitWish}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 確定シフト */}
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                確定シフト
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日付
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        備考
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {finalShifts
                      .filter(shift => shift.employeeId === user?.id)
                      .map((shift) => (
                        <tr key={shift.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {shift.workDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {shift.startTime} - {shift.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {shift.notes}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvailableShiftsPanel({
  selectedDate,
  adminSlots,
  onSelectSlot,
}: {
  selectedDate: string;
  adminSlots: AdminShiftSlot[];
  onSelectSlot: (slotId: string, startTime: string, endTime: string) => void;
}) {
  const slotsForDate = adminSlots.filter(slot => slot.targetDate === selectedDate);

  if (slotsForDate.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {selectedDate}の募集枠がありません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slotsForDate.map((slot) => (
        <div key={slot.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-gray-900">
                {slot.startTime} - {slot.endTime}
              </h4>
              <p className="text-sm text-gray-600">
                募集人数: {slot.requiredPeople}人
              </p>
              {slot.requiredSkills && slot.requiredSkills.length > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-gray-500">必要スキル: </span>
                  {slot.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                // 過去の日付チェック
                const slotDate = new Date(selectedDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (slotDate < today) {
                  alert('過去の日付のシフトには希望を提出できません');
                  return;
                }
                
                onSelectSlot(slot.id, slot.startTime, slot.endTime);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
            >
              希望を提出
            </button>
          </div>
          {slot.notes && (
            <p className="text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded">
              {slot.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ShiftWishForm({
  selectedDate,
  onSubmit,
}: {
  selectedDate: string;
  onSubmit: (slotId: string, startTime: string, endTime: string) => void;
}) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      alert('開始時刻と終了時刻を入力してください');
      return;
    }
    if (startTime >= endTime) {
      alert('終了時刻は開始時刻より後にしてください');
      return;
    }
    onSubmit('', startTime, endTime);
    setStartTime('');
    setEndTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">対象日</label>
        <input
          type="date"
          value={selectedDate}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">希望開始時刻</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">希望終了時刻</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
      >
        希望シフトを提出
      </button>
    </form>
  );
}