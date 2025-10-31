import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Cards from '../components/Cards'
import ChartPanel from '../components/ChartPanel'
import api from '../utils/api'

export default function Home() {
  const [platform, setPlatform] = useState('youtube')
  const [userId, setUserId] = useState(null)
  const [ytProfile, setYtProfile] = useState(null)
  const [ytAnalytics, setYtAnalytics] = useState(null)
  const [igProfile, setIgProfile] = useState(null)
  const [igMedia, setIgMedia] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const uid = params.get('user_id')
    if (uid) setUserId(uid)
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (!userId) return
      setLoading(true)
      try {
        if (platform === 'youtube') {
          const [p, a] = await Promise.all([
            api.get(`/api/youtube/profile`, { params: { user_id: userId } }),
            api.get(`/api/youtube/analytics`, { params: { user_id: userId } })
          ])
          setYtProfile(p.data)
          setYtAnalytics(a.data)
        } else {
          // Need ig_user_id; try from profile first
          const prof = await api.get(`/api/instagram/profile`, { params: { user_id: userId } })
          setIgProfile(prof.data)
          const media = await api.get(`/api/instagram/media`, { params: { user_id: userId } })
          setIgMedia(media.data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [platform, userId])

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
      <Sidebar platform={platform} setPlatform={setPlatform} />
      <main className="flex-1">
        <Topbar platform={platform} profile={profile} />
        <div className="p-6 space-y-6">
          <Cards platform={platform} ytProfile={ytProfile} igProfile={igProfile} ytAnalytics={ytAnalytics} igMedia={igMedia} loading={loading} />
          <ChartPanel platform={platform} ytAnalytics={ytAnalytics} igMedia={igMedia} />
        </div>
      </main>
    </div>
  )
}
