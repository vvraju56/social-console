export default function Cards({ platform, ytProfile, igProfile, ytAnalytics, igMedia, loading }) {
  if (loading) return <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="card p-6 animate-pulse h-24"/><div className="card p-6 animate-pulse h-24"/><div className="card p-6 animate-pulse h-24"/></div>

  const items = []
  if (platform === 'youtube' && ytProfile) {
    const ch = ytProfile?.items?.[0]
    items.push({ label: 'Subscribers', value: ch?.statistics?.subscriberCount || '—' })
    items.push({ label: 'Views', value: ch?.statistics?.viewCount || '—' })
    items.push({ label: 'Videos', value: ch?.statistics?.videoCount || '—' })
  }
  if (platform === 'instagram' && igProfile) {
    items.push({ label: 'Followers', value: igProfile?.followers_count ?? '—' })
    items.push({ label: 'Media', value: igProfile?.media_count ?? '—' })
    items.push({ label: 'Username', value: igProfile?.username ?? '—' })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it, i) => (
        <div className="card p-6" key={i}>
          <div className="text-sm text-neutral-400">{it.label}</div>
          <div className="text-2xl font-semibold mt-2">{it.value}</div>
        </div>
      ))}
    </div>
  )
}
