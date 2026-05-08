import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  ganancias: number;
  pasos: number;
}

interface ChartsProps {
  data: ChartData[];
}

export function EarningsChart({ data }: ChartsProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4">Ganancias por Día</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="ganancias"
            stroke="#10b981"
            strokeWidth={2}
            name="Ganancias ($)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PassagesChart({ data }: ChartsProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4">Flujo de Personas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="pasos"
            fill="#3b82f6"
            name="Personas"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
