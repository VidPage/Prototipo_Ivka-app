import { useState } from 'react';
import { TurnstileMap, Turnstile } from './components/TurnstileMap';
import { TurnstileList } from './components/TurnstileList';
import { TurnstileConfig } from './components/TurnstileConfig';
import { MetricsCard } from './components/MetricsCard';
import { TurnstileMetrics } from './components/TurnstileMetrics';
import { EarningsChart, PassagesChart } from './components/Charts';
import { Logo } from './components/Logo';
import { DollarSign, Users, MapPin, Activity } from 'lucide-react';
import { Toaster } from 'sonner';

const mockTurnstiles: Turnstile[] = [
  {
    id: 'TRN-001',
    name: 'Baño Centro Histórico',
    address: 'Av. Juárez 123, Centro, CDMX',
    lat: 19.4326,
    lng: -99.1332,
    fare: 5,
    status: 'En línea',
    passageTime: 15,
    todayPasses: 342,
    todayEarnings: 1710,
  },
  {
    id: 'TRN-002',
    name: 'Baño Plaza Condesa',
    address: 'Av. Michoacán 45, Condesa, CDMX',
    lat: 19.4105,
    lng: -99.1686,
    fare: 6,
    status: 'En línea',
    passageTime: 20,
    todayPasses: 289,
    todayEarnings: 1734,
  },
  {
    id: 'TRN-003',
    name: 'Baño Terminal Norte',
    address: 'Eje Central Lázaro Cárdenas 4907',
    lat: 19.4897,
    lng: -99.1419,
    fare: 5,
    status: 'Mantenimiento',
    passageTime: 15,
    todayPasses: 156,
    todayEarnings: 780,
  },
  {
    id: 'TRN-004',
    name: 'Baño Parque Chapultepec',
    address: 'Bosque de Chapultepec I Secc',
    lat: 19.4205,
    lng: -99.1954,
    fare: 4,
    status: 'En línea',
    passageTime: 12,
    todayPasses: 521,
    todayEarnings: 2084,
  },
  {
    id: 'TRN-005',
    name: 'Baño Polanco',
    address: 'Av. Presidente Masaryk 201',
    lat: 19.4339,
    lng: -99.1956,
    fare: 8,
    status: 'Fuera de línea',
    passageTime: 18,
    todayPasses: 0,
    todayEarnings: 0,
  },
];

const chartData = [
  { name: 'Lun', ganancias: 4200, pasos: 892 },
  { name: 'Mar', ganancias: 3800, pasos: 756 },
  { name: 'Mié', ganancias: 5100, pasos: 1024 },
  { name: 'Jue', ganancias: 4600, pasos: 934 },
  { name: 'Vie', ganancias: 6800, pasos: 1358 },
  { name: 'Sáb', ganancias: 7200, pasos: 1456 },
  { name: 'Dom', ganancias: 5900, pasos: 1187 },
];

export default function App() {
  const [turnstiles, setTurnstiles] = useState<Turnstile[]>(mockTurnstiles);
  const [selectedTurnstile, setSelectedTurnstile] = useState<Turnstile | undefined>();
  const [configTurnstile, setConfigTurnstile] = useState<Turnstile | undefined>();

  const totalPasses = turnstiles.reduce((sum, t) => sum + t.todayPasses, 0);
  const totalEarnings = turnstiles.reduce((sum, t) => sum + t.todayEarnings, 0);
  const activeTurnstiles = turnstiles.filter(t => t.status === 'En línea').length;
  const avgFare = turnstiles.reduce((sum, t) => sum + t.fare, 0) / turnstiles.length;

  const handleUpdateTurnstile = (updated: Turnstile) => {
    setTurnstiles(prev => prev.map(t => t.id === updated.id ? updated : t));
    setSelectedTurnstile(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="border-b shadow-lg" style={{ background: 'linear-gradient(to right, #314270, #1e2942)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">IVKA-APP</h1>
              <p className="text-sm text-blue-100">Panel de Control - Monitoreo en tiempo real</p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{new Date().toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p className="text-sm text-blue-100">{new Date().toLocaleTimeString('es-MX')}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="Ganancias Hoy"
              value={`$${totalEarnings.toLocaleString()}`}
              icon={DollarSign}
              color="green"
              trend={{ value: 12.5, isPositive: true }}
            />
            <MetricsCard
              title="Pasos Totales"
              value={totalPasses.toLocaleString()}
              icon={Users}
              color="blue"
              trend={{ value: 8.2, isPositive: true }}
            />
            <MetricsCard
              title="Torniquetes Activos"
              value={`${activeTurnstiles} / ${turnstiles.length}`}
              icon={Activity}
              color="purple"
            />
            <MetricsCard
              title="Tarifa Promedio"
              value={`$${avgFare.toFixed(2)}`}
              icon={MapPin}
              color="yellow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[500px]">
            <TurnstileMap
              turnstiles={turnstiles}
              selectedTurnstile={selectedTurnstile}
              onSelectTurnstile={setSelectedTurnstile}
            />
          </div>
          <div>
            <TurnstileList
              turnstiles={turnstiles}
              selectedTurnstile={selectedTurnstile}
              onSelectTurnstile={setSelectedTurnstile}
              onConfigure={setConfigTurnstile}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Análisis General</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EarningsChart data={chartData} />
            <PassagesChart data={chartData} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Métricas Individuales por Torniquete</h2>
          <div className="space-y-6">
            {turnstiles.map((turnstile) => (
              <TurnstileMetrics
                key={turnstile.id}
                turnstile={turnstile}
                onConfigure={setConfigTurnstile}
              />
            ))}
          </div>
        </div>
      </main>

      {configTurnstile && (
        <TurnstileConfig
          turnstile={configTurnstile}
          onClose={() => setConfigTurnstile(undefined)}
          onUpdate={handleUpdateTurnstile}
        />
      )}
    </div>
  );
}
