import Image from 'next/image'
import ThemeToggle from './ThemeToggle'
import NotificationCenter from './NotificationCenter'

export default function Topbar({ platform, profile }) {
  const title = platform === 'youtube' ? 'YouTube' : 'Instagram'
  const avatar = platform === 'youtube'
    ? profile?.items?.[0]?.snippet?.thumbnails?.default?.url
    : profile?.profile_picture_url
  const username = platform === 'youtube'
    ? profile?.items?.[0]?.snippet?.title
    : profile?.username

  return (
    <header className="sticky top-0 z-10 bg-neutral-950/70 backdrop-blur border-b border-neutral-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-6 bg-brand-500 rounded-full"/>
          <h1 className="text-lg font-semibold">{title} dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
          <ThemeToggle />
          {avatar && (
            <Image src={avatar} width={32} height={32} alt="avatar" className="rounded-full" />
          )}
          <span className="text-sm text-neutral-300">{username || 'Not connected'}</span>
        </div>
      </div>
    </header>
  )
}
