import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

function buildYouTubeSeries(ytAnalytics) {
  const items = ytAnalytics?.items || []
  const labels = items.map(i => i.snippet.title?.slice(0, 18) || i.id)
  const views = items.map(i => Number(i.statistics?.viewCount || 0))
  const likes = items.map(i => Number(i.statistics?.likeCount || 0))
  const comments = items.map(i => Number(i.statistics?.commentCount || 0))
  return { labels, datasets: [
    { label: 'Views', data: views, borderColor: '#3a78ff', backgroundColor: 'rgba(58,120,255,0.2)' },
    { label: 'Likes', data: likes, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)' },
    { label: 'Comments', data: comments, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.2)' },
  ]}
}

function buildInstagramSeries(igMedia) {
  const items = igMedia?.data || []
  const last = items.slice(0, 10).reverse()
  const labels = last.map(i => new Date(i.timestamp).toLocaleDateString())
  const likes = last.map(i => Number(i.like_count || 0))
  const comments = last.map(i => Number(i.comments_count || 0))
  return { labels, datasets: [
    { label: 'Likes', data: likes, borderColor: '#e1306c', backgroundColor: 'rgba(225,48,108,0.2)' },
    { label: 'Comments', data: comments, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.2)' },
  ]}
}

export default function ChartPanel({ platform, ytAnalytics, igMedia }) {
  const data = platform === 'youtube' ? buildYouTubeSeries(ytAnalytics) : buildInstagramSeries(igMedia)
  const options = { responsive: true, plugins: { legend: { labels: { color: '#d4d4d4' } } }, scales: { x: { ticks: { color: '#a3a3a3' } }, y: { ticks: { color: '#a3a3a3' } } } }
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Engagement</h2>
      </div>
      <Line data={data} options={options} />
    </div>
  )
}
