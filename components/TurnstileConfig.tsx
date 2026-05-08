import { useState } from 'react';
import { Turnstile } from './TurnstileMap';
import { X, DollarSign, Clock, Calendar, Activity, RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

interface TurnstileConfigProps {
  turnstile: Turnstile;
  onClose: () => void;
  onUpdate: (turnstile: Turnstile) => void;
}

export function TurnstileConfig({ turnstile, onClose, onUpdate }: TurnstileConfigProps) {
  const [fare, setFare] = useState(turnstile.fare);
  const [passageTime, setPassageTime] = useState(turnstile.passageTime);

  const handleSave = () => {
    onUpdate({
      ...turnstile,
      fare,
      passageTime,
    });
    toast.success('Configuración guardada exitosamente');
    onClose();
  };

  const handleResetCounters = () => {
    if (confirm('¿Estás seguro de restablecer los contadores?')) {
      onUpdate({
        ...turnstile,
        todayPasses: 0,
        todayEarnings: 0,
      });
      toast.success('Contadores restablecidos');
    }
  };

  const handleDiagnostic = () => {
    toast.info('Ejecutando diagnóstico...');
    setTimeout(() => {
      toast.success('Diagnóstico completado: Sistema operando correctamente');
    }, 2000);
  };

  const handleSyncDateTime = () => {
    toast.success('Fecha y hora sincronizadas con el servidor');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Configuración de Torniquete</h2>
            <p className="text-sm text-gray-600">{turnstile.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} className="text-gray-600" />
                <label className="font-medium">Tarifa Actual</label>
              </div>
              <input
                type="number"
                value={fare}
                onChange={(e) => setFare(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #314270'}
                onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                step="0.5"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">Costo por uso del baño</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={18} className="text-gray-600" />
                <label className="font-medium">Tiempo de Paso</label>
              </div>
              <input
                type="number"
                value={passageTime}
                onChange={(e) => setPassageTime(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                onFocus={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #314270'}
                onBlur={(e) => e.currentTarget.style.boxShadow = ''}
                step="1"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">Segundos para permitir el paso</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Información del Dispositivo</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">ID del Dispositivo</p>
                <p className="font-medium">{turnstile.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Estado</p>
                <p className="font-medium capitalize">{turnstile.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Ubicación</p>
                <p className="font-medium">{turnstile.address}</p>
              </div>
              <div>
                <p className="text-gray-600">Coordenadas</p>
                <p className="font-medium">{turnstile.lat.toFixed(4)}, {turnstile.lng.toFixed(4)}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleDiagnostic}
                className="flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Activity size={20} style={{ color: '#314270' }} />
                <div className="text-left">
                  <p className="font-medium">Ejecutar Diagnóstico</p>
                  <p className="text-xs text-gray-600">Verificar estado del sistema</p>
                </div>
              </button>

              <button
                onClick={handleSyncDateTime}
                className="flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar size={20} className="text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Sincronizar Fecha/Hora</p>
                  <p className="text-xs text-gray-600">Actualizar reloj del dispositivo</p>
                </div>
              </button>

              <button
                onClick={handleResetCounters}
                className="flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={20} className="text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Restablecer Contadores</p>
                  <p className="text-xs text-gray-600">Resetear pasos y ganancias</p>
                </div>
              </button>
            </div>
          </div>

          <div className="border-t pt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#314270' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#253552'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#314270'}
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
