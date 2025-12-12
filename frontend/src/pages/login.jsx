import Head from 'next/head'
import { useState } from 'react'

export default function Login() {
  const [showFeatures, setShowFeatures] = useState(false)
  
  const goto = async (provider) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const u = await fetch(`${base}/auth/${provider}/url`).then(r => r.json())
    window.location.href = u.url
  }

  const features = [
    {
      title: "Multi-Platform Analytics",
      description: "Connect both YouTube and Instagram accounts in one unified dashboard",
      icon: "📊"
    },
    {
      title: "Real-time Data",
      description: "Live data refresh with customizable intervals and instant notifications",
      icon: "⚡"
    },
    {
      title: "Competitor Analysis",
      description: "Track and compare your performance against competitors",
      icon: "🎯"
    },
    {
      title: "Advanced Insights",
      description: "Deep engagement analytics, growth trends, and performance metrics",
      icon: "🔍"
    },
    {
      title: "Data Export",
      description: "Export your analytics data in CSV, Excel, or JSON formats",
      icon: "📤"
    },
    {
      title: "Multi-Account Support",
      description: "Manage multiple YouTube channels and Instagram accounts",
      icon: "👥"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <Head>
        <title>Social Console - Free YouTube & Instagram Analytics</title>
        <meta name="description" content="Advanced analytics dashboard for YouTube and Instagram creators. Track performance, analyze competitors, and grow your social media presence." />
      </Head>

      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
            <span className="text-xl font-bold text-white">Social Console</span>
          </div>
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="text-neutral-300 hover:text-white transition-colors"
          >
            Features
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Advanced Social Media Analytics
          </h1>
          <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
            The most comprehensive free analytics dashboard for YouTube and Instagram creators. 
            Track performance, analyze competitors, and grow your audience with data-driven insights.
          </p>
          
          {/* Call to Action */}
          <div className="bg-neutral-800 bg-opacity-50 backdrop-blur rounded-2xl p-8 max-w-2xl mx-auto border border-neutral-700">
            <h2 className="text-2xl font-semibold text-white mb-6">Connect Your Accounts</h2>
            <div className="space-y-4 max-w-md mx-auto">
              <button 
                onClick={() => goto('google')} 
                className="w-full py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Continue with Google (YouTube)
              </button>
              <button 
                onClick={() => goto('meta')} 
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
                Continue with Meta (Instagram)
              </button>
            </div>
            <p className="text-center text-sm text-neutral-400 mt-6">
              After connecting, you'll be redirected to your analytics dashboard
            </p>
          </div>
        </div>

        {/* Features Section */}
        {showFeatures && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:bg-neutral-750 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-300">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comparison with competitors */}
        <div className="bg-neutral-800 bg-opacity-50 backdrop-blur rounded-2xl p-8 border border-neutral-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why Choose Social Console?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">100% Free</div>
              <div className="text-neutral-300">No hidden costs or premium tiers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">Multi-Platform</div>
              <div className="text-neutral-300">YouTube + Instagram in one dashboard</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">Real-time</div>
              <div className="text-neutral-300">Live data updates and notifications</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">No Limits</div>
              <div className="text-neutral-300">Unlimited accounts and data export</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
