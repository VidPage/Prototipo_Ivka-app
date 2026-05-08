import { Turnstile } from './TurnstileMap';
import { Settings, TrendingUp, Users, Clock } from 'lucide-react';

interface TurnstileListProps {
  turnstiles: Turnstile[];
  selectedTurnstile?: Turnstile;
  onSelectTurnstile: (turnstile: Turnstile) => void;
  onConfigure: (turnstile: Turnstile) => void;
}

export function TurnstileList({ turnstiles, selectedTurnstile, onSelectTurnstile, onConfigure }: TurnstileListProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">Torniquetes Instalados</h2>
      </div>
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {turnstiles.map((turnstile) => (
          <div
            key={turnstile.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedTurnstile?.id === turnstile.id ? 'border-l-4' : ''
            }`}
            style={selectedTurnstile?.id === turnstile.id ? {
              backgroundColor: '#f0f2f8',
              borderLeftColor: '#314270'
            } : {}}
            onClick={() => onSelectTurnstile(turnstile)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base mb-1">{turnstile.name}</h3>
                <p className="text-sm text-gray-600">{turnstile.address}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigure(turnstile);
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Configurar"
              >
                <Settings size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-block w-2 h-2 rounded-full ${
                turnstile.status === 'En línea' ? 'bg-green-500' :
                turnstile.status === 'Fuera de línea' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></span>
              <span className="text-sm capitalize font-medium">{turnstile.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Pasos</p>
                  <p className="text-sm font-semibold">{turnstile.todayPasses}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Ganancias</p>
                  <p className="text-sm font-semibold">${turnstile.todayEarnings}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Tiempo</p>
                  <p className="text-sm font-semibold">{turnstile.passageTime}s</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
