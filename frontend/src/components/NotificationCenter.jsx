import { useState, useEffect } from 'react'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState({
    followerThreshold: 100,
    engagementThreshold: 5.0,
    weeklyReport: true,
    dailyDigest: false
  })

  useEffect(() => {
    // Load notifications and settings from localStorage
    const storedNotifications = localStorage.getItem('notifications')
    const storedSettings = localStorage.getItem('notificationSettings')
    
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications))
    }
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }

    // Generate some demo notifications
    generateDemoNotifications()
  }, [])

  const generateDemoNotifications = () => {
    const demoNotifications = [
      {
        id: '1',
        type: 'milestone',
        title: 'Milestone Reached! 🎉',
        message: 'Your channel reached 10,000 subscribers',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        platform: 'youtube'
      },
      {
        id: '2',
        type: 'engagement',
        title: 'High Engagement Alert',
        message: 'Your last video has 8.5% engagement rate',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
        platform: 'youtube'
      },
      {
        id: '3',
        type: 'growth',
        title: 'Growth Spike',
        message: 'Instagram followers increased by 250 this week',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        platform: 'instagram'
      },
      {
        id: '4',
        type: 'alert',
        title: 'Performance Alert',
        message: 'Video views dropped 15% compared to last week',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        read: true,
        platform: 'youtube'
      }
    ]
    
    setNotifications(demoNotifications)
  }

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('notifications', JSON.stringify(updated))
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.setItem('notifications', JSON.stringify([]))
  }

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
  }

  const getNotificationIcon = (type) => {
    const icons = {
      milestone: '🎉',
      engagement: '📈',
      growth: '🌱',
      alert: '⚠️'
    }
    return icons[type] || '📢'
  }

  const getNotificationColor = (type) => {
    const colors = {
      milestone: 'text-green-400',
      engagement: 'text-blue-400',
      growth: 'text-purple-400',
      alert: 'text-yellow-400'
    }
    return colors[type] || 'text-gray-400'
  }

  const getPlatformIcon = (platform) => {
    return platform === 'youtube' ? '▶️' : '📷'
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="relative p-2 text-neutral-300 hover:text-white hover:bg-neutral-700 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showSettings && (
        <div className="absolute right-0 mt-2 w-96 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-neutral-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-neutral-700 hover:bg-neutral-700 cursor-pointer ${!notification.read ? 'bg-neutral-750' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${getNotificationColor(notification.type)}`}>
                          {notification.title}
                        </span>
                        <span className="text-xs">{getPlatformIcon(notification.platform)}</span>
                      </div>
                      <p className="text-sm text-neutral-300 mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Settings */}
          <div className="p-4 border-t border-neutral-700">
            <h4 className="font-medium mb-3">Alert Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-neutral-300">Follower milestone</label>
                <input
                  type="number"
                  value={settings.followerThreshold}
                  onChange={(e) => updateSettings({...settings, followerThreshold: Number(e.target.value)})}
                  className="w-full mt-1 px-3 py-1 bg-neutral-700 border border-neutral-600 rounded text-white"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-300">Engagement threshold (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.engagementThreshold}
                  onChange={(e) => updateSettings({...settings, engagementThreshold: Number(e.target.value)})}
                  className="w-full mt-1 px-3 py-1 bg-neutral-700 border border-neutral-600 rounded text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="weeklyReport"
                  checked={settings.weeklyReport}
                  onChange={(e) => updateSettings({...settings, weeklyReport: e.target.checked})}
                  className="rounded text-blue-600"
                />
                <label htmlFor="weeklyReport" className="text-sm text-neutral-300">Weekly summary</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="dailyDigest"
                  checked={settings.dailyDigest}
                  onChange={(e) => updateSettings({...settings, dailyDigest: e.target.checked})}
                  className="rounded text-blue-600"
                />
                <label htmlFor="dailyDigest" className="text-sm text-neutral-300">Daily digest</label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}