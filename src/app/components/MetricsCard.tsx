import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function MetricsCard({ title, value, icon: Icon, trend, color = 'blue' }: MetricsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
  }[color];

  const colorStyle = color === 'blue' ? { backgroundColor: '#e8ecf5', color: '#314270' } : {};

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-semibold mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs. ayer</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`} style={colorStyle}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
