'use client';

import React, { useState } from 'react';
import SummaryView from '@/components/SummaryView';
import CancerDetectionView from '@/components/CancerDetectionView';
import HotspotInsightsView from '@/components/HotspotInsightsView';

export default function Home() {
  const [activeView, setActiveView] = useState<'summary' | 'cancer' | 'hotspots'>('summary');

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl">Abu Dhabi Public Health</span>
            </div>
            <div className="flex space-x-4">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'summary' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveView('summary')}
              >
                Summary View
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'cancer' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveView('cancer')}
              >
                Cancer Detection
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'hotspots' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveView('hotspots')}
              >
                Hotspot Insights
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {activeView === 'summary' && <SummaryView />}
        {activeView === 'cancer' && <CancerDetectionView />}
        {activeView === 'hotspots' && <HotspotInsightsView />}
      </div>
    </div>
  );
}
