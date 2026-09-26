import React, { useState, useEffect } from 'react';
import { Megaphone, ExternalLink, Settings, X, Sparkles } from 'lucide-react';
import { AdConfig } from '../types';

interface AdBannerSlotProps {
  format?: 'leaderboard' | 'card' | 'banner';
  slotId?: string;
  className?: string;
  label?: string;
}

export const AD_CONFIG_STORAGE_KEY = 'baalvarta_ad_config_v1';

export function getStoredAdConfig(): AdConfig {
  try {
    const raw = localStorage.getItem(AD_CONFIG_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return {
    enabled: true,
    adSenseClientId: '',
  };
}

export function saveStoredAdConfig(config: AdConfig): void {
  try {
    localStorage.setItem(AD_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export const AdBannerSlot: React.FC<AdBannerSlotProps> = ({
  format = 'leaderboard',
  slotId = 'default',
  className = '',
  label,
}) => {
  const [adConfig, setAdConfig] = useState<AdConfig>(() => getStoredAdConfig());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [clientInput, setClientInput] = useState(adConfig.adSenseClientId || '');
  const [snippetInput, setSnippetInput] = useState(adConfig.customCodeSnippet || '');

  useEffect(() => {
    const handleStorageChange = () => {
      setAdConfig(getStoredAdConfig());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!adConfig.enabled) {
    return null;
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdConfig = {
      ...adConfig,
      adSenseClientId: clientInput.trim(),
      customCodeSnippet: snippetInput.trim(),
    };
    setAdConfig(updated);
    saveStoredAdConfig(updated);
    setShowConfigModal(false);
  };

  return (
    <div className={`my-4 sm:my-6 w-full ${className}`}>
      {/* If custom HTML code snippet is provided */}
      {adConfig.customCodeSnippet ? (
        <div
          className="w-full overflow-hidden flex justify-center bg-slate-50 border border-slate-200 rounded-2xl p-2"
          dangerouslySetInnerHTML={{ __html: adConfig.customCodeSnippet }}
        />
      ) : (
        /* Default Responsive Placeholder Slot ready for AdSense / Ad Networks */
        <div
          className={`relative w-full rounded-2xl border-2 border-dashed border-amber-300/80 bg-gradient-to-r from-amber-50/60 via-orange-50/40 to-yellow-50/60 overflow-hidden flex flex-col items-center justify-center transition-all p-3 sm:p-4 text-center group ${
            format === 'card'
              ? 'min-h-[200px] sm:min-h-[250px]'
              : 'min-h-[90px] sm:min-h-[105px]'
          }`}
        >
          {/* Subtle Sponsor/Ad Tag */}
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-800/80 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200">
            <Megaphone className="w-3 h-3 text-amber-600" />
            <span>{label || 'विज्ञापन स्थान (Ad Space)'}</span>
          </div>

          {/* Quick Ad Config Gear button for Website Owner */}
          <button
            onClick={() => setShowConfigModal(true)}
            title="AdSense कोड यहाँ सेट करें"
            className="absolute top-2 right-2 p-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-400 hover:text-amber-600 shadow-xs border border-slate-200 transition-all text-xs flex items-center gap-1 opacity-70 group-hover:opacity-100 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] font-bold">Ad Code</span>
          </button>

          <div className="space-y-1 mt-2 sm:mt-1 max-w-md">
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Google AdSense / प्रायोजक बैनर स्थान</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              यहाँ आप बाद में आसानी से अपना AdSense Script या Banner Ad कोड जोड़ सकते हैं।
            </p>
          </div>

          <div className="mt-2 text-[10px] text-amber-700/80 font-bold bg-white/70 px-3 py-1 rounded-lg border border-amber-200">
            Slot: {slotId} ({format === 'card' ? '300x250 Medium Rectangle' : 'Responsive Leaderboard 728x90'})
          </div>
        </div>
      )}

      {/* Ad Setup Quick Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-400 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Google AdSense / विज्ञापन कोड सेटिंग
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Google AdSense Client ID (उदा: ca-pub-XXXXXXXXXXXXXXXX)
                </label>
                <input
                  type="text"
                  value={clientInput}
                  onChange={(e) => setClientInput(e.target.value)}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  या पूरा AdSense / Ad Script कोड यहाँ पेस्ट करें (Custom HTML Snippet):
                </label>
                <textarea
                  rows={4}
                  value={snippetInput}
                  onChange={(e) => setSnippetInput(e.target.value)}
                  placeholder={`<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-..." data-ad-slot="..." data-ad-format="auto"></ins>`}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const toggled = !adConfig.enabled;
                    setAdConfig({ ...adConfig, enabled: toggled });
                    saveStoredAdConfig({ ...adConfig, enabled: toggled });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    adConfig.enabled
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {adConfig.enabled ? 'विज्ञापन छुपाएं (Disable Ads)' : 'विज्ञापन दिखाएं (Enable Ads)'}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-white font-black hover:bg-amber-600 shadow-md cursor-pointer"
                  >
                    सुरक्षित करें (Save)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
