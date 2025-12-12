import { useState, useEffect } from 'react'

export default function DateRangeFilter({ onDateRangeChange, onRefresh, loading }) {
  const [dateRange, setDateRange] = useState('7d')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds

  useEffect(() => {
    let interval = null
    if (autoRefresh) {
      interval = setInterval(() => {
        onRefresh()
      }, refreshInterval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, onRefresh])

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    onDateRangeChange(range)
  }

  const getDateRangeText = (range) => {
    const ranges = {
      '1d': 'Last 24 hours',
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
      'all': 'All time'
    }
    return ranges[range] || range
  }

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-300">Date Range:</span>
          <div className="flex gap-2">
            {['1d', '7d', '30d', '90d', 'all'].map(range => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                {getDateRangeText(range)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-neutral-300">Auto-refresh</span>
            </label>
            {autoRefresh && (
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="bg-neutral-700 text-neutral-300 rounded px-2 py-1 text-sm"
              >
                <option value={15000}>15s</option>
                <option value={30000}>30s</option>
                <option value={60000}>1m</option>
                <option value={300000}>5m</option>
              </select>
            )}
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              loading
                ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>
    </div>
  )
}