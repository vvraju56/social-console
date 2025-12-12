import { useState, useEffect } from 'react'
import api from '../utils/api'

export default function AccountManager({ platform, onAccountSelect }) {
  const [accounts, setAccounts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAccount, setNewAccount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [platform])

  const loadAccounts = async () => {
    try {
      const response = await api.get(`/api/${platform}/accounts`)
      setAccounts(response.data || [])
    } catch (error) {
      console.error('Failed to load accounts:', error)
    }
  }

  const addAccount = async () => {
    if (!newAccount.trim()) return
    
    setLoading(true)
    try {
      if (platform === 'youtube') {
        // Add YouTube channel by ID
        await api.post(`/api/youtube/add-channel`, { channel_id: newAccount })
      } else {
        // Add Instagram account (would need OAuth flow)
        window.location.href = `/auth/meta/url?add_account=true`
      }
      
      setShowAddModal(false)
      setNewAccount('')
      loadAccounts()
    } catch (error) {
      console.error('Failed to add account:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeAccount = async (accountId) => {
    if (!confirm('Are you sure you want to remove this account?')) return
    
    try {
      await api.delete(`/api/${platform}/accounts/${accountId}`)
      loadAccounts()
    } catch (error) {
      console.error('Failed to remove account:', error)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {platform === 'youtube' ? 'YouTube Channels' : 'Instagram Accounts'}
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Add Account
        </button>
      </div>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-neutral-400">
            <p>No accounts connected yet</p>
            <p className="text-sm mt-2">Click "Add Account" to get started</p>
          </div>
        ) : (
          accounts.map(account => (
            <div key={account.id} className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                  {platform === 'youtube' ? (
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium">{account.name || account.username || account.channelTitle}</div>
                  <div className="text-sm text-neutral-400">
                    {platform === 'youtube' 
                      ? `${account.subscribers || 'N/A'} subscribers` 
                      : `${account.followers || 'N/A'} followers`
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAccountSelect(account)}
                  className="px-3 py-1 text-sm bg-neutral-700 text-white rounded hover:bg-neutral-600"
                >
                  View
                </button>
                <button
                  onClick={() => removeAccount(account.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add {platform === 'youtube' ? 'YouTube Channel' : 'Instagram Account'}
            </h3>
            
            {platform === 'youtube' ? (
              <div>
                <label className="block text-sm font-medium mb-2">Channel ID or URL</label>
                <input
                  type="text"
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  placeholder="UC... or youtube.com/channel/UC..."
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400"
                />
                <p className="text-xs text-neutral-400 mt-2">
                  Enter the channel ID or full channel URL
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-neutral-300 mb-4">
                  You'll be redirected to Instagram to authorize your account.
                </p>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
              >
                Cancel
              </button>
              {platform === 'youtube' && (
                <button
                  onClick={addAccount}
                  disabled={loading || !newAccount.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Channel'}
                </button>
              )}
              {platform === 'instagram' && (
                <button
                  onClick={() => {
                    window.location.href = `/auth/meta/url?add_account=true`
                  }}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                  Connect Instagram
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}