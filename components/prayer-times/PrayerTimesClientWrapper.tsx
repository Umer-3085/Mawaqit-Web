'use client';

import { TodayPrayerTimesClient } from './TodayPrayerTimesClient';
import { Button } from '@/components/ui/Button';
import { getTodayISO } from '../../lib/date-utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PrayerTimesResponse, LocationParams } from '@/types/prayer-times';

interface PrayerTimesClientWrapperProps {
  initialData: PrayerTimesResponse | null;
  initialParams: LocationParams;
}

export function PrayerTimesClientWrapper({
  initialData,
  initialParams,
}: PrayerTimesClientWrapperProps) {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (date) {
      setSelectedDate(date);
      router.push('/prayer-times/' + date);
    }
    setShowDatePicker(false);
  };

  return (
    <>
      <div className='flex items-center justify-between mb-4'>
        <TodayPrayerTimesClient
          initialData={initialData}
          initialParams={initialParams}
          isDatePage={false}
        />
      </div>
      
      {/* View Another Date Button - only on today page */}
      <div className='mt-6 pt-4 border-t border-border/40'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowDatePicker(true)}
          className='w-full sm:w-auto flex items-center gap-2'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
          View Another Date
        </Button>
        
        {showDatePicker && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='bg-surface rounded-xl p-6 w-full max-w-md shadow-xl border border-border'>
              <h3 className='text-lg font-semibold text-text mb-4'>Select Date</h3>
              <input
                type='date'
                value={selectedDate}
                onChange={handleDateSelect}
                onBlur={() => setShowDatePicker(false)}
                className='w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary'
                max={getTodayISO()}
              />
              <div className='flex justify-end gap-2 mt-4'>
                <Button variant='ghost' size='sm' onClick={() => setShowDatePicker(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}