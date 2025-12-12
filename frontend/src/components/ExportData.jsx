import { useState } from 'react'

export default function ExportData({ platform, ytAnalytics, igMedia, ytProfile, igProfile }) {
  const [exporting, setExporting] = useState(false)

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString()
  }

  const generateCSV = (type) => {
    let csv = ''
    let filename = ''

    if (platform === 'youtube' && ytAnalytics) {
      const items = ytAnalytics?.items || []
      
      if (type === 'summary') {
        csv = 'Metric,Value\n'
        csv += `Total Videos,${items.length}\n`
        csv += `Total Views,${formatNumber(items.reduce((sum, i) => sum + Number(i.statistics?.viewCount || 0), 0))}\n`
        csv += `Total Likes,${formatNumber(items.reduce((sum, i) => sum + Number(i.statistics?.likeCount || 0), 0))}\n`
        csv += `Total Comments,${formatNumber(items.reduce((sum, i) => sum + Number(i.statistics?.commentCount || 0), 0))}\n`
        filename = 'youtube_summary.csv'
      } else if (type === 'detailed') {
        csv = 'Title,Views,Likes,Comments,Published Date,URL\n'
        items.forEach(item => {
          const title = (item.snippet?.title || '').replace(/"/g, '""')
          const views = item.statistics?.viewCount || 0
          const likes = item.statistics?.likeCount || 0
          const comments = item.statistics?.commentCount || 0
          const published = item.snippet?.publishedAt || ''
          const url = `https://youtube.com/watch?v=${item.id}`
          csv += `"${title}",${views},${likes},${comments},"${published}","${url}"\n`
        })
        filename = 'youtube_detailed.csv'
      }
    } else if (platform === 'instagram' && igMedia) {
      const items = igMedia?.data || []
      
      if (type === 'summary') {
        csv = 'Metric,Value\n'
        csv += `Followers,${formatNumber(igProfile?.followers_count || 0)}\n`
        csv += `Total Posts,${items.length}\n`
        csv += `Total Likes,${formatNumber(items.reduce((sum, i) => sum + Number(i.like_count || 0), 0))}\n`
        csv += `Total Comments,${formatNumber(items.reduce((sum, i) => sum + Number(i.comments_count || 0), 0))}\n`
        csv += `Avg Engagement Rate,${((items.reduce((sum, i) => sum + Number(i.like_count || 0) + Number(i.comments_count || 0), 0) / (igProfile?.followers_count || 1) / items.length) * 100).toFixed(2)}%\n`
        filename = 'instagram_summary.csv'
      } else if (type === 'detailed') {
        csv = 'Caption,Likes,Comments,Media Type,Permalink,Timestamp\n'
        items.forEach(item => {
          const caption = (item.caption || '').replace(/"/g, '""').substring(0, 100)
          const likes = item.like_count || 0
          const comments = item.comments_count || 0
          const mediaType = item.media_type || 'unknown'
          const permalink = item.permalink || ''
          const timestamp = item.timestamp || ''
          csv += `"${caption}",${likes},${comments},"${mediaType}","${permalink}","${timestamp}"\n`
        })
        filename = 'instagram_detailed.csv'
      }
    }

    return { csv, filename }
  }

  const downloadCSV = (type) => {
    setExporting(true)
    
    try {
      const { csv, filename } = generateCSV(type)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const generateJSON = () => {
    setExporting(true)
    
    try {
      const data = {
        platform,
        exportedAt: new Date().toISOString(),
        profile: platform === 'youtube' ? ytProfile : igProfile,
        analytics: platform === 'youtube' ? ytAnalytics : igMedia
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `${platform}_analytics.json`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Export Data</h3>
          <p className="text-sm text-neutral-400">Download your analytics data in various formats</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => downloadCSV('summary')}
            disabled={exporting}
            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? 'Exporting...' : 'CSV Summary'}
          </button>
          
          <button
            onClick={() => downloadCSV('detailed')}
            disabled={exporting}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? 'Exporting...' : 'CSV Detailed'}
          </button>
          
          <button
            onClick={generateJSON}
            disabled={exporting}
            className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? 'Exporting...' : 'JSON'}
          </button>
        </div>
      </div>
    </div>
  )
}