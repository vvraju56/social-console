import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Cards from '../components/Cards'
import ChartPanel from '../components/ChartPanel'
import AdvancedAnalytics from '../components/AdvancedAnalytics'
import DateRangeFilter from '../components/DateRangeFilter'
import ExportData from '../components/ExportData'
import CompetitorAnalysis from '../components/CompetitorAnalysis'
import AccountManager from '../components/AccountManager'
import api from '../utils/api'

export default function Home() {
  const [platform, setPlatform] = useState('youtube')
  const [userId, setUserId] = useState(null)
  const [ytProfile, setYtProfile] = useState(null)
  const [ytAnalytics, setYtAnalytics] = useState(null)
  const [igProfile, setIgProfile] = useState(null)
  const [igMedia, setIgMedia] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dateRange, setDateRange] = useState('7d')
  const [viewMode, setViewMode] = useState('overview') // overview, advanced

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const uid = params.get('user_id')
    if (uid) setUserId(uid)
  }, [])

  const fetchData = async () => {
    if (!userId) return
    setLoading(true)
    try {
      if (platform === 'youtube') {
        const [p, a] = await Promise.all([
          api.get(`/api/youtube/profile`, { params: { user_id: userId } }),
          api.get(`/api/youtube/analytics`, { params: { user_id: userId, date_range: dateRange } })
        ])
        setYtProfile(p.data)
        setYtAnalytics(a.data)
      } else {
        const prof = await api.get(`/api/instagram/profile`, { params: { user_id: userId } })
        setIgProfile(prof.data)
        const media = await api.get(`/api/instagram/media`, { params: { user_id: userId, date_range: dateRange } })
        setIgMedia(media.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [platform, userId, dateRange])

  const meta = useMemo(() => ({
    title: 'Social Console',
    description: 'YouTube + Instagram analytics dashboard'
  }), [])

  const profile = platform === 'youtube' ? ytProfile : igProfile

  return (
    <div className="min-h-screen flex dark:bg-neutral-900">
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
      <Sidebar 
        platform={platform} 
        setPlatform={setPlatform} 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <main className="flex-1">
        <Topbar platform={platform} profile={profile} />
        <div className="p-6 space-y-6">
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                viewMode === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
              }`}
            >
              Advanced Analytics
            </button>
          </div>

          {/* Date Range Filter */}
          <DateRangeFilter
            onDateRangeChange={setDateRange}
            onRefresh={fetchData}
            loading={loading}
          />

          {/* Content based on view mode */}
          {viewMode === 'overview' ? (
            <>
              <Cards platform={platform} ytProfile={ytProfile} igProfile={igProfile} ytAnalytics={ytAnalytics} igMedia={igMedia} loading={loading} />
              <ChartPanel platform={platform} ytAnalytics={ytAnalytics} igMedia={igMedia} />
            </>
          ) : (
            <>
              <AdvancedAnalytics platform={platform} ytAnalytics={ytAnalytics} igMedia={igMedia} igProfile={igProfile} />
              <CompetitorAnalysis 
                platform={platform} 
                currentAccount={platform === 'youtube' ? ytProfile?.items?.[0] : igProfile}
              />
              <AccountManager 
                platform={platform} 
                onAccountSelect={(account) => {
                  // Handle account selection
                  console.log('Selected account:', account)
                }}
              />
            </>
          )}

          {/* Export Component */}
          <ExportData 
            platform={platform} 
            ytAnalytics={ytAnalytics} 
            igMedia={igMedia} 
            ytProfile={ytProfile} 
            igProfile={igProfile}
          />
        </div>
      </main>
    </div>
  )
}
