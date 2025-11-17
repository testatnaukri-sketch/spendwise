import { AnalyticsData, ExportData, Transaction, CategorySpend, MonthlyTrend } from '@/types'
import { format } from 'date-fns'
import Papa from 'papaparse'
import jsPDF from 'jspdf'

export function generateCSVExport(data: AnalyticsData, fileName: string = 'analytics'): ExportData {
  const csvContent: string[] = []

  // Summary section
  csvContent.push('Spendwise Analytics Report')
  csvContent.push(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
  csvContent.push('')

  // Income/Expenses summary
  csvContent.push('Summary')
  csvContent.push('Metric,Amount')
  csvContent.push(`Total Income,${data.incomeTotal.toFixed(2)}`)
  csvContent.push(`Total Expenses,${data.expensesTotal.toFixed(2)}`)
  csvContent.push(`Balance,${data.balance.toFixed(2)}`)
  csvContent.push('')

  // Category breakdown
  csvContent.push('Category Breakdown')
  csvContent.push('Category,Amount,Percentage,Count')
  data.categorySpends.forEach((spend) => {
    csvContent.push(
      `"${spend.category_name}",${spend.total_amount.toFixed(2)},${spend.percentage.toFixed(2)}%,${spend.transaction_count}`
    )
  })
  csvContent.push('')

  // Monthly trends
  csvContent.push('Monthly Trends')
  csvContent.push('Month,Income,Expenses,Net')
  data.monthlyTrends.forEach((trend) => {
    csvContent.push(
      `${trend.month},${trend.income.toFixed(2)},${trend.expenses.toFixed(2)},${trend.net.toFixed(2)}`
    )
  })
  csvContent.push('')

  // Top expenses
  if (data.topExpenses.length > 0) {
    csvContent.push('Top Expenses')
    csvContent.push('Date,Description,Amount,Category')
    data.topExpenses.forEach((expense) => {
      csvContent.push(
        `${expense.date},"${expense.description}",${expense.amount.toFixed(2)},"${expense.category_id}"`
      )
    })
    csvContent.push('')
  }

  // Anomalies
  if (data.anomalies.length > 0) {
    csvContent.push('Spending Anomalies')
    csvContent.push('Date,Category,Amount,Above Average %')
    data.anomalies.forEach((anomaly) => {
      csvContent.push(
        `${anomaly.date},"${anomaly.category_name}",${anomaly.amount.toFixed(2)},${anomaly.percentageAboveAverage.toFixed(2)}%`
      )
    })
  }

  const csvString = csvContent.join('\n')

  return {
    fileName: `${fileName}_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`,
    content: csvString,
    mimeType: 'text/csv;charset=utf-8;',
  }
}

export function generatePDFExport(data: AnalyticsData, fileName: string = 'analytics'): ExportData {
  const doc = new jsPDF()
  let yPosition = 10

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 10
  const lineHeight = 7

  // Helper function to add text with auto-wrapping
  const addText = (text: string, size: number = 12, bold: boolean = false) => {
    doc.setFontSize(size)
    doc.setFont(undefined, bold ? 'bold' : 'normal')

    if (yPosition > pageHeight - margin - 10) {
      doc.addPage()
      yPosition = margin
    }

    doc.text(text, margin, yPosition)
    yPosition += lineHeight
  }

  const addTable = (headers: string[], rows: (string | number)[][], startY: number) => {
    const cellPadding = 2
    const colWidths = headers.map((h) => (pageWidth - 2 * margin) / headers.length)

    let currentY = startY
    const headerHeight = lineHeight + cellPadding

    // Draw header
    headers.forEach((header, i) => {
      const x = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0)
      doc.setFillColor(220, 220, 220)
      doc.rect(x, currentY, colWidths[i], headerHeight, 'F')
      doc.text(header, x + cellPadding, currentY + lineHeight)
    })

    currentY += headerHeight

    // Draw rows
    rows.forEach((row) => {
      if (currentY > pageHeight - margin - 10) {
        doc.addPage()
        currentY = margin
      }

      row.forEach((cell, i) => {
        const x = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(String(cell), x + cellPadding, currentY + lineHeight)
      })

      currentY += lineHeight
    })

    return currentY
  }

  // Title
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('Spendwise Analytics Report', margin, yPosition)
  yPosition += 10

  // Date
  addText(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`, 10)
  yPosition += 2

  // Summary section
  addText('Summary', 14, true)
  const summaryRows = [
    ['Total Income', `$${data.incomeTotal.toFixed(2)}`],
    ['Total Expenses', `$${data.expensesTotal.toFixed(2)}`],
    ['Balance', `$${data.balance.toFixed(2)}`],
  ]
  yPosition = addTable(['Metric', 'Amount'], summaryRows, yPosition)
  yPosition += 5

  // Category breakdown
  addText('Category Breakdown', 14, true)
  const categoryRows = data.categorySpends.map((spend) => [
    spend.category_name,
    `$${spend.total_amount.toFixed(2)}`,
    `${spend.percentage.toFixed(1)}%`,
    spend.transaction_count,
  ])
  yPosition = addTable(['Category', 'Amount', 'Percentage', 'Count'], categoryRows, yPosition)
  yPosition += 5

  // Monthly trends
  addText('Monthly Trends', 14, true)
  const trendRows = data.monthlyTrends.map((trend) => [
    trend.month,
    `$${trend.income.toFixed(2)}`,
    `$${trend.expenses.toFixed(2)}`,
    `$${trend.net.toFixed(2)}`,
  ])
  yPosition = addTable(['Month', 'Income', 'Expenses', 'Net'], trendRows, yPosition)

  const pdfBlob = doc.output('blob')

  return {
    fileName: `${fileName}_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.pdf`,
    content: pdfBlob,
    mimeType: 'application/pdf',
  }
}

export function downloadFile(exportData: ExportData): void {
  const link = document.createElement('a')
  const url = exportData.content instanceof Blob ? URL.createObjectURL(exportData.content) : exportData.content

  link.href = typeof url === 'string' && !exportData.content.toString().startsWith('data:') ? `data:${exportData.mimeType},${encodeURIComponent(String(exportData.content))}` : url
  link.download = exportData.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  if (exportData.content instanceof Blob) {
    URL.revokeObjectURL(url)
  }
}

export function exportAnalyticsData(data: AnalyticsData, format: 'csv' | 'pdf'): void {
  const exportData = format === 'csv' ? generateCSVExport(data) : generatePDFExport(data)
  downloadFile(exportData)
}
