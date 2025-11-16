'use client';

import { useState } from 'react';
import { PurchaseAdvisor } from './PurchaseAdvisor';
import type { PurchaseAdvisorInput } from '@/types';

interface AdvisorPanelProps {
  token: string;
  input: PurchaseAdvisorInput;
  title?: string;
}

export function AdvisorPanel({
  token,
  input,
  title = 'Purchase Advisor',
}: AdvisorPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🤖</span>
            {title}
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            {isOpen ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-6">
          <PurchaseAdvisor token={token} input={input} />
        </div>
      )}
    </div>
  );
}
