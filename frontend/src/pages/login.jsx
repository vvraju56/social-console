import Head from 'next/head'

export default function Login() {
  const goto = async (provider) => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const u = await fetch(`${base}/auth/${provider}/url`).then(r => r.json())
    window.location.href = u.url
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white p-6">
      <Head><title>Login</title></Head>
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Connect your accounts</h1>
        <div className="card p-6 space-y-4">
          <button onClick={() => goto('google')} className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700">Continue with Google (YouTube)</button>
          <button onClick={() => goto('meta')} className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700">Continue with Meta (Instagram)</button>
        </div>
        <p className="text-center text-sm text-neutral-400">After connecting, you will be redirected to the dashboard.</p>
      </div>
    </div>
  )
}
