import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement)

function calculateEngagementRate(likes, comments, followers) {
  if (!followers || followers === 0) return 0
  return ((likes + comments) / followers * 100).toFixed(2)
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function buildYouTubeGrowthData(ytAnalytics) {
  const items = ytAnalytics?.items || []
  const sortedItems = items.sort((a, b) => new Date(a.snippet.publishedAt) - new Date(b.snippet.publishedAt))
  
  return {
    labels: sortedItems.map(i => new Date(i.snippet.publishedAt).toLocaleDateString()),
    datasets: [{
      label: 'Video Performance',
      data: sortedItems.map(i => Number(i.statistics?.viewCount || 0)),
      borderColor: '#3a78ff',
      backgroundColor: 'rgba(58,120,255,0.1)',
      tension: 0.4
    }]
  }
}

function buildYouTubeEngagementData(ytAnalytics) {
  const items = ytAnalytics?.items || []
  return {
    labels: items.slice(0, 5).map(i => i.snippet.title?.slice(0, 20) + '...' || i.id),
    datasets: [
      {
        label: 'Views',
        data: items.slice(0, 5).map(i => Number(i.statistics?.viewCount || 0)),
        backgroundColor: '#3a78ff'
      },
      {
        label: 'Likes',
        data: items.slice(0, 5).map(i => Number(i.statistics?.likeCount || 0)),
        backgroundColor: '#22c55e'
      }
    ]
  }
}

function buildYouTubeMetrics(ytAnalytics) {
  const items = ytAnalytics?.items || []
  const totalViews = items.reduce((sum, i) => sum + Number(i.statistics?.viewCount || 0), 0)
  const totalLikes = items.reduce((sum, i) => sum + Number(i.statistics?.likeCount || 0), 0)
  const totalComments = items.reduce((sum, i) => sum + Number(i.statistics?.commentCount || 0), 0)
  const avgEngagement = items.length > 0 ? 
    ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : 0

  return { totalViews, totalLikes, totalComments, avgEngagement }
}

function buildInstagramEngagementData(igMedia) {
  const items = igMedia?.data || []
  const last10 = items.slice(0, 10).reverse()
  
  return {
    labels: last10.map(i => new Date(i.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Likes',
        data: last10.map(i => Number(i.like_count || 0)),
        borderColor: '#e1306c',
        backgroundColor: 'rgba(225,48,108,0.1)',
        tension: 0.4
      },
      {
        label: 'Comments',
        data: last10.map(i => Number(i.comments_count || 0)),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        tension: 0.4
      }
    ]
  }
}

function buildInstagramMetrics(igMedia, igProfile) {
  const items = igMedia?.data || []
  const followers = igProfile?.followers_count || 0
  const totalLikes = items.reduce((sum, i) => sum + Number(i.like_count || 0), 0)
  const totalComments = items.reduce((sum, i) => sum + Number(i.comments_count || 0), 0)
  const avgEngagement = followers > 0 ? 
    ((totalLikes + totalComments) / (followers * items.length) * 100).toFixed(2) : 0

  return { totalLikes, totalComments, avgEngagement, followers }
}

function buildInstagramMediaTypes(igMedia) {
  const items = igMedia?.data || []
  const mediaTypes = items.reduce((acc, item) => {
    const type = item.media_type || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return {
    labels: Object.keys(mediaTypes).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
    datasets: [{
      data: Object.values(mediaTypes),
      backgroundColor: ['#e1306c', '#f59e0b', '#22c55e', '#3a78ff'],
      borderWidth: 0
    }]
  }
}

export default function AdvancedAnalytics({ platform, ytAnalytics, igMedia, igProfile }) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#d4d4d4' }
      }
    },
    scales: {
      x: { 
        ticks: { color: '#a3a3a3' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: { 
        ticks: { color: '#a3a3a3' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#d4d4d4' }
      }
    }
  }

  if (platform === 'youtube') {
    const metrics = buildYouTubeMetrics(ytAnalytics)
    const growthData = buildYouTubeGrowthData(ytAnalytics)
    const engagementData = buildYouTubeEngagementData(ytAnalytics)

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Total Views</div>
            <div className="text-2xl font-bold mt-2 text-blue-400">{formatNumber(metrics.totalViews)}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Total Likes</div>
            <div className="text-2xl font-bold mt-2 text-green-400">{formatNumber(metrics.totalLikes)}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Total Comments</div>
            <div className="text-2xl font-bold mt-2 text-yellow-400">{formatNumber(metrics.totalComments)}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Avg Engagement</div>
            <div className="text-2xl font-bold mt-2 text-purple-400">{metrics.avgEngagement}%</div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Video Performance Trend</h3>
          <div className="h-64">
            <Line data={growthData} options={chartOptions} />
          </div>
        </div>

        {/* Engagement Comparison */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Video Performance</h3>
          <div className="h-64">
            <Bar data={engagementData} options={chartOptions} />
          </div>
        </div>
      </div>
    )
  }

  if (platform === 'instagram') {
    const metrics = buildInstagramMetrics(igMedia, igProfile)
    const engagementData = buildInstagramEngagementData(igMedia)
    const mediaTypesData = buildInstagramMediaTypes(igMedia)

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Followers</div>
            <div className="text-2xl font-bold mt-2 text-pink-400">{formatNumber(metrics.followers)}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Total Likes</div>
            <div className="text-2xl font-bold mt-2 text-red-400">{formatNumber(metrics.totalLikes)}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Total Comments</div>
            <div className="text-2xl font-bold mt-2 text-yellow-400">{formatNumber(metrics.totalComments)}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm text-neutral-400">Avg Engagement</div>
            <div className="text-2xl font-bold mt-2 text-purple-400">{metrics.avgEngagement}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Trend */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement Trend</h3>
            <div className="h-64">
              <Line data={engagementData} options={chartOptions} />
            </div>
          </div>

          {/* Media Types */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Content Types</h3>
            <div className="h-64">
              <Doughnut data={mediaTypesData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}