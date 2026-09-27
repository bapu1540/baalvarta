import React, { useState } from 'react';
import { StateSidebar } from './StateSidebar';
import { InteractiveIndiaMap } from './InteractiveIndiaMap';
import { StateDistrictsListView } from './StateDistrictsListView';
import { StateDetailsCard } from './StateDetailsCard';
import { ALL_INDIA_REGIONS, IndiaRegionItem } from '../../data/indiaData';
import { Language } from '../../types';
import { playPopSound } from '../../utils/soundEffects';

interface IndiaMapSectionProps {
  language: Language;
  soundEnabled: boolean;
  viewMode?: 'india' | 'state';
}

export const IndiaMapSection: React.FC<IndiaMapSectionProps> = ({
  language,
  soundEnabled,
  viewMode = 'india',
}) => {
  const [selectedId, setSelectedId] = useState<string>('gujarat'); // Default selected state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'states' | 'uts'>('states');

  const selectedItem: IndiaRegionItem =
    ALL_INDIA_REGIONS.find((r) => r.id === selectedId) || ALL_INDIA_REGIONS[0];

  const handleSelectRegion = (item: IndiaRegionItem) => {
    if (soundEnabled) playPopSound();
    setSelectedId(item.id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-3 py-1 sm:py-2 px-1 sm:px-4 font-sans">
      {/* SIDE-BY-SIDE MAIN SECTION (Grid on ALL screen sizes: Left Sidebar + Right View) */}
      <div className="grid grid-cols-12 gap-1.5 sm:gap-4 items-start">
        {/* LEFT SIDEBAR (col-span-5 on mobile, col-span-4 on sm/desktop) */}
        <div className="col-span-5 sm:col-span-4">
          <StateSidebar
            language={language}
            selectedId={selectedId}
            onSelectRegion={handleSelectRegion}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            soundEnabled={soundEnabled}
          />
        </div>

        {/* RIGHT SIDE (Render StateDistrictsListView in 'state' mode [NO MAP], InteractiveIndiaMap in 'india' mode) */}
        <div className="col-span-7 sm:col-span-8">
          {viewMode === 'state' ? (
            <StateDistrictsListView
              language={language}
              selectedItem={selectedItem}
              soundEnabled={soundEnabled}
            />
          ) : (
            <InteractiveIndiaMap
              language={language}
              selectedId={selectedId}
              onSelectRegion={handleSelectRegion}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>

      {/* EDUCATIONAL STATE DETAILS CARD BELOW */}
      <StateDetailsCard
        language={language}
        selectedItem={selectedItem}
        onSelectRegion={handleSelectRegion}
        soundEnabled={soundEnabled}
      />
    </div>
  );
};
