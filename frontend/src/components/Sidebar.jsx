import Link from 'next/link'

export default function Sidebar({ platform, setPlatform, viewMode, setViewMode }) {
  return (
    <aside className="w-64 hidden md:block bg-neutral-950 text-neutral-200 min-h-screen border-r border-neutral-800">
      <div className="p-6 text-xl font-semibold">Social Console</div>
      <nav className="px-3 space-y-2">
        <div className="pb-2">
          <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Platform</div>
          <button onClick={() => setPlatform('youtube')} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 ${platform==='youtube'?'bg-neutral-800 text-white':''}`}>YouTube</button>
          <button onClick={() => setPlatform('instagram')} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 ${platform==='instagram'?'bg-neutral-800 text-white':''}`}>Instagram</button>
        </div>
        
        <div className="pt-2 border-t border-neutral-800">
          <div className="px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Analytics</div>
          <button onClick={() => setViewMode('overview')} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 ${viewMode==='overview'?'bg-neutral-800 text-white':''}`}>Overview</button>
          <button onClick={() => setViewMode('advanced')} className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-800 ${viewMode==='advanced'?'bg-neutral-800 text-white':''}`}>Advanced</button>
        </div>
        
        <div className="pt-2 border-t border-neutral-800">
          <Link href="/login" className="block px-4 py-3 text-sm text-neutral-400 hover:text-white">Connect accounts</Link>
        </div>
      </nav>
    </aside>
  )
}
