import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = {
  movie: '#ef4444',
  book: '#3b82f6',
  manga: '#ec4899',
  comic: '#10b981',
}

function CategoryPieChart({ data, loading }) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-800/50" />
  }

  const labels = (data || []).map(d => d.name.charAt(0).toUpperCase() + d.name.slice(1))
  const values = (data || []).map(d => d.value)
  const colors = (data || []).map(d => COLORS[d.name] || '#64748b')

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return `${ctx.label}: ₦${ctx.parsed.toLocaleString()} (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div className="rounded-xl bg-slate-900/50 p-5 ring-1 ring-slate-800">
      <h3 className="mb-4 text-sm font-semibold text-white">Revenue by Category</h3>
      <div className="h-64 flex items-center justify-center">
        {values.every(v => v === 0) ? (
          <p className="text-sm text-gray-500">No data yet</p>
        ) : (
          <Doughnut data={chartData} options={options} />
        )}
      </div>
    </div>
  )
}

export default CategoryPieChart
