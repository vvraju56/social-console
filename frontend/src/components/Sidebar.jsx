import Link from 'next/link'

export default function Sidebar({ platform, setPlatform }) {
  return (
    <aside className="w-64 hidden md:block bg-neutral-950 text-neutral-200 min-h-screen border-r border-neutral-800">
      <div className="p-6 text-xl font-semibold">Social Console</div>
      <nav className="px-3 space-y-2">
        <button onClick={() => setPlatform('youtube')} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 ${platform==='youtube'?'bg-neutral-800 text-white':''}`}>YouTube</button>
        <button onClick={() => setPlatform('instagram')} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 ${platform==='instagram'?'bg-neutral-800 text-white':''}`}>Instagram</button>
        <Link href="/login" className="block px-4 py-3 text-sm text-neutral-400 hover:text-white">Connect accounts</Link>
      </nav>
    </aside>
  )
}
