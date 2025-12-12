import { useState, useEffect } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

export default function CompetitorAnalysis({ platform, currentAccount, onAddCompetitor }) {
  const [competitors, setCompetitors] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCompetitor, setNewCompetitor] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCompetitors()
  }, [platform, currentAccount])

  const loadCompetitors = () => {
    // Load from localStorage or API
    const stored = localStorage.getItem(`competitors_${platform}_${currentAccount?.id}`)
    if (stored) {
      setCompetitors(JSON.parse(stored))
    }
  }

  const addCompetitor = () => {
    if (!newCompetitor.trim()) return
    
    setLoading(true)
    
    // For demo purposes, add mock data
    const competitor = {
      id: Date.now().toString(),
      name: newCompetitor,
      followers: Math.floor(Math.random() * 1000000) + 10000,
      engagement: (Math.random() * 10).toFixed(2),
      growth: (Math.random() * 20 - 10).toFixed(2),
      posts: Math.floor(Math.random() * 500) + 50,
      avgLikes: Math.floor(Math.random() * 10000) + 1000,
      avgComments: Math.floor(Math.random() * 1000) + 100,
      platform
    }
    
    const updatedCompetitors = [...competitors, competitor]
    setCompetitors(updatedCompetitors)
    localStorage.setItem(`competitors_${platform}_${currentAccount?.id}`, JSON.stringify(updatedCompetitors))
    
    setNewCompetitor('')
    setShowAddModal(false)
    setLoading(false)
  }

  const removeCompetitor = (id) => {
    const updatedCompetitors = competitors.filter(c => c.id !== id)
    setCompetitors(updatedCompetitors)
    localStorage.setItem(`competitors_${platform}_${currentAccount?.id}`, JSON.stringify(updatedCompetitors))
  }

  const buildComparisonData = () => {
    const allAccounts = [currentAccount, ...competitors].filter(Boolean)
    
    return {
      labels: allAccounts.map(acc => acc.name || acc.username || acc.channelTitle || 'You'),
      datasets: [
        {
          label: platform === 'youtube' ? 'Subscribers' : 'Followers',
          data: allAccounts.map(acc => acc.subscribers || acc.followers || 0),
          backgroundColor: allAccounts.map((_, index) => 
            index === 0 ? '#3a78ff' : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`
          )
        },
        {
          label: 'Avg Engagement',
          data: allAccounts.map(acc => acc.avgEngagement || acc.engagement || 0),
          backgroundColor: allAccounts.map((_, index) => 
            index === 0 ? '#22c55e' : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`
          )
        }
      ]
    }
  }

  const buildGrowthData = () => {
    const allAccounts = [currentAccount, ...competitors].filter(Boolean)
    
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: allAccounts.map((account, index) => ({
        label: account.name || account.username || account.channelTitle || 'You',
        data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 10000) + 1000),
        borderColor: index === 0 ? '#3a78ff' : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        backgroundColor: 'transparent',
        tension: 0.4
      }))
    }
  }

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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Competitor Analysis</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Add Competitor
          </button>
        </div>

        {/* Competitor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[currentAccount, ...competitors].filter(Boolean).map((account, index) => (
            <div key={account.id || 'current'} className={`p-4 rounded-lg border ${index === 0 ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-neutral-800 border-neutral-700'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">
                  {account.name || account.username || account.channelTitle || 'You'}
                  {index === 0 && <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">You</span>}
                </h4>
                {index !== 0 && (
                  <button
                    onClick={() => removeCompetitor(account.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">
                    {platform === 'youtube' ? 'Subscribers' : 'Followers'}:
                  </span>
                  <span>{formatNumber(account.subscribers || account.followers || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Engagement:</span>
                  <span>{account.avgEngagement || account.engagement || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Growth Rate:</span>
                  <span className={parseFloat(account.growth) >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {account.growth >= 0 ? '+' : ''}{account.growth || 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="h-64 mb-6">
          <Bar data={buildComparisonData()} options={chartOptions} />
        </div>

        {/* Growth Trend */}
        <div className="h-64">
          <Line data={buildGrowthData()} options={chartOptions} />
        </div>
      </div>

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add Competitor</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                {platform === 'youtube' ? 'Channel Name or ID' : 'Instagram Username'}
              </label>
              <input
                type="text"
                value={newCompetitor}
                onChange={(e) => setNewCompetitor(e.target.value)}
                placeholder={platform === 'youtube' ? 'Enter channel name...' : '@username'}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={addCompetitor}
                disabled={loading || !newCompetitor.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Competitor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}