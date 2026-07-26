import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

function OrderVolumeChart({ data, loading }) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-800/50" />
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Orders',
        data: data?.values || [],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', maxTicksLimit: 10 },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#64748b', stepSize: 1 },
      },
    },
  }

  return (
    <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
      <h3 className="mb-4 text-sm font-semibold text-white">Order Volume (Last 30 Days)</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default OrderVolumeChart
