import { Turnstile } from './TurnstileMap';
import { DollarSign, Users, Clock, TrendingUp, Settings } from 'lucide-react';

interface TurnstileMetricsProps {
  turnstile: Turnstile;
  onConfigure: (turnstile: Turnstile) => void;
}

export function TurnstileMetrics({ turnstile, onConfigure }: TurnstileMetricsProps) {
  const getStatusColor = (status: string) => {
    if (status === 'En línea') return 'text-green-600 bg-green-100';
    if (status === 'Fuera de línea') return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const avgPerHour = Math.round(turnstile.todayPasses / 12);
  const efficiency = turnstile.status === 'En línea' ? 98 : 0;

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-6 py-4 text-white" style={{ background: 'linear-gradient(to right, #314270, #253552)' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{turnstile.name}</h3>
            <p className="text-sm opacity-90">{turnstile.address}</p>
            <p className="text-xs opacity-75 mt-1">ID: {turnstile.id}</p>
          </div>
          <button
            onClick={() => onConfigure(turnstile)}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            aria-label="Configurar"
          >
            <Settings size={20} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(turnstile.status)}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            <span className="capitalize">{turnstile.status}</span>
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-center mb-2">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">${turnstile.todayEarnings}</p>
            <p className="text-xs text-gray-600 mt-1">Ganancias Hoy</p>
          </div>

          <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: '#e8ecf5', borderColor: '#c5cfe0' }}>
            <div className="flex justify-center mb-2">
              <Users size={24} style={{ color: '#314270' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#314270' }}>{turnstile.todayPasses}</p>
            <p className="text-xs text-gray-600 mt-1">Pasos Totales</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex justify-center mb-2">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{avgPerHour}</p>
            <p className="text-xs text-gray-600 mt-1">Promedio/Hora</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex justify-center mb-2">
              <Clock size={24} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-700">{turnstile.passageTime}s</p>
            <p className="text-xs text-gray-600 mt-1">Tiempo de Paso</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Tarifa Actual</span>
            <span className="font-semibold text-lg">${turnstile.fare}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Eficiencia</span>
            <span className="font-semibold text-lg">{efficiency}%</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Ingresos/Paso</span>
            <span className="font-semibold text-lg">${turnstile.todayPasses > 0 ? (turnstile.todayEarnings / turnstile.todayPasses).toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
