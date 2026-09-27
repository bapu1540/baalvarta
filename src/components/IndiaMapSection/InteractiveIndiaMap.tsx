import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move
} from 'lucide-react';
import { ALL_INDIA_REGIONS, IndiaRegionItem } from '../../data/indiaData';
import { Language } from '../../types';

interface InteractiveIndiaMapProps {
  language: Language;
  selectedId: string;
  onSelectRegion: (item: IndiaRegionItem) => void;
  viewMode?: 'india' | 'state';
}

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  language,
  selectedId,
  onSelectRegion,
  viewMode = 'india',
}) => {
  const isHi = language === 'hi';
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const selectedItem =
    ALL_INDIA_REGIONS.find((r) => r.id === selectedId) || ALL_INDIA_REGIONS[0];

  // Auto-center on selected state when in 'state' viewMode
  useEffect(() => {
    if (viewMode === 'state' && selectedItem) {
      // Scale up to 2.4x and calculate translation so selectedItem.center is at (306, 320)
      const targetZoom = 2.4;
      const targetPanX = (306 - selectedItem.center.x) * (targetZoom - 0.3);
      const targetPanY = (320 - selectedItem.center.y) * (targetZoom - 0.3);
      setZoomLevel(targetZoom);
      setPanOffset({ x: targetPanX, y: targetPanY });
    }
  }, [viewMode, selectedId]);

  // Reset Zoom & Pan
  const handleReset = () => {
    if (viewMode === 'state' && selectedItem) {
      const targetZoom = 2.4;
      const targetPanX = (306 - selectedItem.center.x) * (targetZoom - 0.3);
      const targetPanY = (320 - selectedItem.center.y) * (targetZoom - 0.3);
      setZoomLevel(targetZoom);
      setPanOffset({ x: targetPanX, y: targetPanY });
    } else {
      setZoomLevel(1.0);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Nudge Pan Offset with Arrow Controls
  const handleNudge = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 45;
    setPanOffset((prev) => {
      switch (direction) {
        case 'up':
          return { ...prev, y: prev.y + step };
        case 'down':
          return { ...prev, y: prev.y - step };
        case 'left':
          return { ...prev, x: prev.x + step };
        case 'right':
          return { ...prev, x: prev.x - step };
        default:
          return prev;
      }
    });
  };

  // Mouse / Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanOffset({
      x: e.touches[0].clientX - dragStartRef.current.x,
      y: e.touches[0].clientY - dragStartRef.current.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full bg-white border-2 sm:border-[3px] border-slate-900 rounded-2xl sm:rounded-3xl p-1.5 sm:p-3 relative flex flex-col items-center justify-between h-[460px] sm:h-[620px] shadow-sm overflow-hidden font-sans">
      {/* 1. TOP HEADER BAR: Selected State Info + Zoom & Pan Controls */}
      <div className="w-full flex items-center justify-between gap-1.5 p-1.5 sm:p-2 bg-slate-100/90 rounded-xl sm:rounded-2xl border border-slate-200 z-20 shrink-0">
        {/* Left: Selected State/UT Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-sm sm:text-xl shrink-0">{selectedItem.icon}</span>
          <div className="min-w-0 leading-tight">
            <div className="font-black text-[11px] sm:text-sm text-slate-900 truncate">
              {viewMode === 'state' ? (
                <span className="text-blue-700">🏛️ {isHi ? 'सिंगल राज्य फ़ोकस:' : 'Single State View:'} </span>
              ) : null}
              {selectedItem.nameEn}{' '}
              <span className="text-blue-600 font-bold text-[10px] sm:text-xs">
                ({selectedItem.nameHi})
              </span>
            </div>
            <div className="text-[9px] sm:text-xs text-slate-500 font-semibold truncate">
              🏛️ {isHi ? selectedItem.capitalHi : selectedItem.capitalEn}
            </div>
          </div>
        </div>

        {/* Right: Zoom & Pan Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white p-1 rounded-lg sm:rounded-xl border border-slate-300 shadow-2xs shrink-0">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.35, 3.2))}
            className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 text-slate-800 transition-all active:scale-95"
            title={isHi ? 'ज़ूम इन (+)' : 'Zoom In (+)'}
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.35, 0.8))}
            className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 text-slate-800 transition-all active:scale-95"
            title={isHi ? 'ज़ूम आउट (-)' : 'Zoom Out (-)'}
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 sm:p-1.5 rounded-md sm:rounded-lg hover:bg-slate-100 text-slate-800 transition-all active:scale-95"
            title={isHi ? 'रिसेट' : 'Reset'}
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* 2. DIRECTIONAL PAN BUTTONS OVERLAY (Move Left, Right, Up, Down) */}
      <div className="absolute top-14 right-2 z-20 flex flex-col items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-xl border border-slate-300 shadow-sm select-none">
        <div className="text-[9px] font-black text-slate-500 flex items-center gap-0.5 px-1">
          <Move className="w-2.5 h-2.5 text-blue-600" />
          <span>Pan</span>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          <div />
          <button
            onClick={() => handleNudge('up')}
            className="p-1 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 active:scale-90"
            title="Pan Up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <div />
          <button
            onClick={() => handleNudge('left')}
            className="p-1 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 active:scale-90"
            title="Pan Left"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded-md bg-blue-50 text-blue-600 font-black text-[9px]"
            title="Center"
          >
            •
          </button>
          <button
            onClick={() => handleNudge('right')}
            className="p-1 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 active:scale-90"
            title="Pan Right"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
          <div />
          <button
            onClick={() => handleNudge('down')}
            className="p-1 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 active:scale-90"
            title="Pan Down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
          <div />
        </div>
      </div>

      {/* 3. MAIN SVG MAP CANVAS WITH DRAG PAN */}
      <div
        className="relative w-full flex-1 flex items-center justify-center overflow-hidden my-1 cursor-grab active:cursor-grabbing touch-none select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          viewBox="0 0 612 696"
          className="w-full h-full max-h-[500px] filter drop-shadow-2xs"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS & CLIPPING PATHS (Separates Jammu & Kashmir and Ladakh cleanly) */}
          <defs>
            <clipPath id="jkClip">
              <rect x="0" y="0" width="168" height="200" />
            </clipPath>
            <clipPath id="ladakhClip">
              <rect x="168" y="0" width="300" height="200" />
            </clipPath>
          </defs>

          <g
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: '306px 320px',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            {/* Ocean Watermark Labels */}
            <text x="50" y="520" fill="#0284c7" opacity="0.3" fontSize="10" fontWeight="bold" fontStyle="italic">
              Arabian Sea
            </text>
            <text x="410" y="500" fill="#0284c7" opacity="0.3" fontSize="10" fontWeight="bold" fontStyle="italic">
              Bay of Bengal
            </text>

            {/* RENDER STATES & UTs SVG PATHS */}
            {ALL_INDIA_REGIONS.map((region) => {
              const isSelected = selectedId === region.id;
              const isHovered = hoveredId === region.id;

              // Color Logic: Pure white background default, Crisp Black Borders, Royal Blue when Selected!
              let fillColor = '#ffffff';
              let opacity = 1.0;

              if (viewMode === 'state') {
                if (isSelected) {
                  fillColor = '#2563eb'; // Bright Royal Blue for focused state
                  opacity = 1.0;
                } else {
                  fillColor = '#f8fafc'; // Faded background states
                  opacity = 0.4;
                }
              } else {
                if (isSelected) {
                  fillColor = '#2563eb'; // Royal Blue
                } else if (isHovered) {
                  fillColor = '#dbeafe'; // Soft Sky Blue on hover
                }
              }

              // Apply clipping path specifically for Jammu & Kashmir (West) and Ladakh (East)
              let clipUrl: string | undefined = undefined;
              if (region.id === 'jammu-and-kashmir') {
                clipUrl = 'url(#jkClip)';
              } else if (region.id === 'ladakh') {
                clipUrl = 'url(#ladakhClip)';
              }

              return (
                <g
                  key={region.id}
                  className="cursor-pointer transition-all duration-150"
                  onClick={() => onSelectRegion(region)}
                  onMouseEnter={() => setHoveredId(region.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  opacity={opacity}
                >
                  {/* State SVG Path with Crisp Dark Borders */}
                  <path
                    d={region.svgPath}
                    fill={fillColor}
                    stroke={isSelected ? '#1d4ed8' : '#000000'}
                    strokeWidth={isSelected ? '3.0' : '1.1'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    clipPath={clipUrl}
                    className="transition-colors duration-150 hover:brightness-95"
                  />

                  {/* Highlight Glow Effect for Selected State */}
                  {isSelected && (
                    <path
                      d={region.svgPath}
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="3.8"
                      strokeOpacity="0.5"
                      strokeLinejoin="round"
                      clipPath={clipUrl}
                      pointerEvents="none"
                    />
                  )}

                  {/* State Number Badge or Pin */}
                  {!region.isIslandOrTiny ? (
                    <g transform={`translate(${region.center.x}, ${region.center.y})`} pointerEvents="none">
                      <circle
                        r={isSelected ? 10 : 7.5}
                        fill={isSelected ? '#ffffff' : '#0f172a'}
                        stroke={isSelected ? '#2563eb' : '#ffffff'}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dy="3"
                        fontSize={isSelected ? '9' : '6.5'}
                        fontWeight="900"
                        fill={isSelected ? '#1d4ed8' : '#ffffff'}
                      >
                        {region.type === 'state' ? region.number : `U${region.number}`}
                      </text>
                    </g>
                  ) : (
                    <g transform={`translate(${region.center.x}, ${region.center.y})`} pointerEvents="none">
                      <circle
                        r={isSelected ? 8 : 5.5}
                        fill={isSelected ? '#2563eb' : '#a855f7'}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dy="2.2"
                        fontSize="6"
                        fontWeight="bold"
                        fill="#ffffff"
                      >
                        {region.number}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* CALLOUT POINTERS FOR SMALL UTs & ISLANDS */}
            <g transform="translate(186, 210)" pointerEvents="none">
              <line x1="0" y1="0" x2="-25" y2="-10" stroke="#0f172a" strokeWidth="1.2" />
              <text x="-28" y="-12" textAnchor="end" fontSize="9" fontWeight="bold" fill="#0f172a">
                Delhi
              </text>
            </g>

            <g transform="translate(142, 475)" pointerEvents="none">
              <line x1="0" y1="0" x2="-30" y2="0" stroke="#0f172a" strokeWidth="1.2" />
              <text x="-34" y="3" textAnchor="end" fontSize="9" fontWeight="bold" fill="#0f172a">
                Goa
              </text>
            </g>

            <g transform="translate(244, 595)" pointerEvents="none">
              <line x1="0" y1="0" x2="30" y2="10" stroke="#0f172a" strokeWidth="1.2" />
              <text x="34" y="13" textAnchor="start" fontSize="9" fontWeight="bold" fill="#0f172a">
                Puducherry
              </text>
            </g>

            <text x="500" y="595" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">
              Andaman & Nicobar Islands
            </text>
            <text x="110" y="615" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">
              Lakshadweep
            </text>
          </g>
        </svg>
      </div>

      {/* 4. BOTTOM LEGEND BAR */}
      <div className="w-full flex items-center justify-between px-2 py-1 bg-slate-50 rounded-xl border border-slate-200 z-10 shrink-0 select-none">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-800">
          <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-700 shrink-0" />
          <span>{isHi ? 'राज्य (State)' : 'State'}</span>
        </div>
        <div className="text-[10px] sm:text-xs text-slate-500 font-semibold">
          💡 {isHi ? 'ड्रैग करके नक्शा हिलाएं (Drag to Pan Map)' : 'Drag or use arrows to pan'}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-800">
          <span className="w-3 h-3 rounded-full bg-purple-600 border border-purple-700 shrink-0" />
          <span>{isHi ? 'संघ राज्य (UT)' : 'UT'}</span>
        </div>
      </div>
    </div>
  );
};
