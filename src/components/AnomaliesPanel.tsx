import React from 'react'
import { SpendingAnomaly } from '@/types'
import { AlertCircle } from 'lucide-react'

interface AnomaliesPanelProps {
  anomalies: SpendingAnomaly[]
  isLoading?: boolean
}

export const AnomaliesPanel: React.FC<AnomaliesPanelProps> = ({ anomalies, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
          Spending Anomalies
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
        Spending Anomalies
      </h3>

      {anomalies.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No anomalies detected in this period</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {anomalies.map((anomaly, index) => (
            <div
              key={index}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{anomaly.category_name}</p>
                  <p className="text-sm text-gray-600">{anomaly.date}</p>
                  <p className="text-sm text-orange-600 font-semibold mt-1">
                    {anomaly.percentageAboveAverage.toFixed(1)}% above average
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">${anomaly.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
