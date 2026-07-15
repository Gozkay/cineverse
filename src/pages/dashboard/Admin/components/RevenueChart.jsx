import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

function RevenueChart({ data, loading }) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-800/50" />
  }

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Revenue (₦)',
        data: data?.values || [],
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#7c3aed',
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
        callbacks: {
          label: (ctx) => `₦${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)', display: false },
        ticks: { color: '#64748b', maxTicksLimit: 10 },
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: {
          color: '#64748b',
          callback: (v) => `₦${(v / 1000).toFixed(0)}k`,
        },
      },
    },
  }

  return (
    <div className="rounded-2xl bg-slate-900/50 p-5 ring-1 ring-white/5">
      <h3 className="mb-4 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Revenue (Last 30 Days)</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default RevenueChart
