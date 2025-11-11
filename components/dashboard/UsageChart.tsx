'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyUsage, SolarMonthlyUsage } from '@/lib/types';

interface UsageChartProps {
  usageHistory: MonthlyUsage[] | SolarMonthlyUsage[];
}

export default function UsageChart({ usageHistory }: UsageChartProps) {
  // Check if this is solar data
  const isSolarData = usageHistory.length > 0 && 'consumption_kwh' in usageHistory[0];

  const data = usageHistory.map((month) => {
    const monthName = new Date(month.month).toLocaleString('en-US', { month: 'short' });

    if (isSolarData) {
      const solarMonth = month as SolarMonthlyUsage;
      return {
        month: monthName,
        kwh: solarMonth.consumption_kwh,
        generation: solarMonth.generation_kwh,
      };
    } else {
      const regularMonth = month as MonthlyUsage;
      return {
        month: monthName,
        kwh: regularMonth.kwh,
      };
    }
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => `${value} kWh`}
          labelStyle={{ color: '#000' }}
        />
        <Line
          type="monotone"
          dataKey="kwh"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ fill: '#16a34a' }}
          name={isSolarData ? 'Consumption' : 'Usage'}
        />
        {isSolarData && (
          <Line
            type="monotone"
            dataKey="generation"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b' }}
            name="Solar Generation"
            strokeDasharray="5 5"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
