import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateCSVExport, generatePDFExport, downloadFile, exportAnalyticsData } from '../exporters'
import { AnalyticsData } from '@/types'

describe('Export Utilities', () => {
  let mockAnalyticsData: AnalyticsData

  beforeEach(() => {
    mockAnalyticsData = {
      categorySpends: [
        {
          category_id: 'cat1',
          category_name: 'Food',
          total_amount: 150,
          transaction_count: 5,
          percentage: 60,
        },
        {
          category_id: 'cat2',
          category_name: 'Transport',
          total_amount: 100,
          transaction_count: 3,
          percentage: 40,
        },
      ],
      monthlyTrends: [
        {
          month: 'Jan 2024',
          income: 3000,
          expenses: 1500,
          net: 1500,
        },
        {
          month: 'Feb 2024',
          income: 3000,
          expenses: 1600,
          net: 1400,
        },
      ],
      incomeTotal: 6000,
      expensesTotal: 3100,
      balance: 2900,
      topExpenses: [
        {
          id: '1',
          user_id: 'user1',
          category_id: 'cat1',
          amount: 75,
          description: 'Restaurant',
          date: '2024-02-15',
          type: 'expense',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      anomalies: [
        {
          date: '2024-02-10',
          category_name: 'Transport',
          amount: 500,
          percentageAboveAverage: 250,
        },
      ],
    }
  })

  describe('generateCSVExport', () => {
    it('should generate CSV content with all sections', () => {
      const result = generateCSVExport(mockAnalyticsData)

      expect(result.content).toContain('Spendwise Analytics Report')
      expect(result.content).toContain('Summary')
      expect(result.content).toContain('Category Breakdown')
      expect(result.content).toContain('Monthly Trends')
      expect(result.mimeType).toBe('text/csv;charset=utf-8;')
    })

    it('should include financial totals in CSV', () => {
      const result = generateCSVExport(mockAnalyticsData)

      expect(result.content).toContain('6000')
      expect(result.content).toContain('3100')
      expect(result.content).toContain('2900')
    })

    it('should include category data', () => {
      const result = generateCSVExport(mockAnalyticsData)

      expect(result.content).toContain('Food')
      expect(result.content).toContain('Transport')
      expect(result.content).toContain('150')
      expect(result.content).toContain('100')
    })

    it('should include top expenses when present', () => {
      const result = generateCSVExport(mockAnalyticsData)

      expect(result.content).toContain('Top Expenses')
      expect(result.content).toContain('Restaurant')
    })

    it('should include anomalies when present', () => {
      const result = generateCSVExport(mockAnalyticsData)

      expect(result.content).toContain('Spending Anomalies')
      expect(result.content).toContain('Transport')
    })

    it('should generate valid filename with timestamp', () => {
      const result = generateCSVExport(mockAnalyticsData, 'test-report')

      expect(result.fileName).toMatch(/test-report_\d{4}-\d{2}-\d{2}_\d{6}\.csv/)
    })
  })

  describe('generatePDFExport', () => {
    it('should generate PDF export', () => {
      const result = generatePDFExport(mockAnalyticsData)

      expect(result.content).toBeInstanceOf(Blob)
      expect(result.mimeType).toBe('application/pdf')
    })

    it('should generate valid filename with timestamp', () => {
      const result = generatePDFExport(mockAnalyticsData, 'test-report')

      expect(result.fileName).toMatch(/test-report_\d{4}-\d{2}-\d{2}_\d{6}\.pdf/)
    })

    it('should create a Blob object', () => {
      const result = generatePDFExport(mockAnalyticsData)

      expect(result.content).toBeDefined()
      expect(typeof result.content).toBe('object')
    })
  })

  describe('downloadFile', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      document.body.innerHTML = ''
    })

    it('should create download link for string content', () => {
      const createElementSpy = vi.spyOn(document, 'createElement')
      const appendChildSpy = vi.spyOn(document.body, 'appendChild')
      const removeChildSpy = vi.spyOn(document.body, 'removeChild')

      const exportData = {
        fileName: 'test.csv',
        content: 'test,data\n1,2',
        mimeType: 'text/csv',
      }

      downloadFile(exportData)

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(removeChildSpy).toHaveBeenCalled()
    })

    it('should handle Blob content', () => {
      const blob = new Blob(['test'], { type: 'text/plain' })
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url')
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL')

      const exportData = {
        fileName: 'test.txt',
        content: blob,
        mimeType: 'text/plain',
      }

      downloadFile(exportData)

      expect(createObjectURLSpy).toHaveBeenCalledWith(blob)
    })
  })

  describe('exportAnalyticsData', () => {
    beforeEach(() => {
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => document.body)
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)
    })

    it('should export as CSV when format is csv', () => {
      const exportSpy = vi.spyOn(global, 'exportAnalyticsData' as any)

      expect(() => {
        exportAnalyticsData(mockAnalyticsData, 'csv')
      }).not.toThrow()
    })

    it('should export as PDF when format is pdf', () => {
      expect(() => {
        exportAnalyticsData(mockAnalyticsData, 'pdf')
      }).not.toThrow()
    })
  })
})
