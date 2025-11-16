import React, { useState } from 'react'
import { AnalyticsData } from '@/types'
import { exportAnalyticsData } from '@/utils/exporters'
import { Download, FileText, File } from 'lucide-react'

interface ExportControlsProps {
  data: AnalyticsData | null
  isLoading?: boolean
}

export const ExportControls: React.FC<ExportControlsProps> = ({ data, isLoading }) => {
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!data) return

    try {
      setExporting(true)
      exportAnalyticsData(data, format)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const isDisabled = !data || isLoading || exporting

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-800">Export Report</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={isDisabled}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isDisabled}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <File className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  )
}
