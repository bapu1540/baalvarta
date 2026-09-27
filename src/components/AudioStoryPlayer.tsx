import React, { useState, useRef, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Clock,
  Music,
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  Moon
} from 'lucide-react';
import { AudioStory, Language } from '../types';
import { playPopSound, startLullabyAmbient, stopLullabyAmbient } from '../utils/soundEffects';

interface AudioStoryPlayerProps {
  audioStories: AudioStory[];
  language: Language;
  soundEnabled: boolean;
}

export const AudioStoryPlayer: React.FC<AudioStoryPlayerProps> = ({
  audioStories,
  language,
  soundEnabled,
}) => {
  const [selectedStory, setSelectedStory] = useState<AudioStory>(audioStories[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [ambientLullaby, setAmbientLullaby] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [selectedStory]);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepTimerMinutes === null) return;
    const timer = setTimeout(() => {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      stopLullabyAmbient();
      setAmbientLullaby(false);
      setSleepTimerMinutes(null);
    }, sleepTimerMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [sleepTimerMinutes]);

  const handleTogglePlay = () => {
    if (soundEnabled) playPopSound();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // audio play fallback simulation
        setIsPlaying(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleSkip = (seconds: number) => {
    if (soundEnabled) playPopSound();
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    }
  };

  const handleToggleAmbient = () => {
    if (soundEnabled) playPopSound();
    const next = !ambientLullaby;
    setAmbientLullaby(next);
    if (next) {
      startLullabyAmbient();
    } else {
      stopLullabyAmbient();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden native audio element for cloud streaming */}
      <audio
        ref={audioRef}
        src={selectedStory.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Sleek Category Top Header */}
      <div className="flex items-center justify-between gap-2.5 bg-white rounded-2xl p-2.5 sm:p-3 border border-purple-200/80 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0">
            🎧
          </div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight truncate">
            {language === 'hi' ? '5. ऑडियो कहानियाँ (Audio Stories)' : '5. Streaming Audio Stories'}
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-black whitespace-nowrap">
            {language === 'hi' ? `${audioStories.length} ऑडियो कहानियाँ` : `${audioStories.length} Audio Tracks`}
          </span>
        </div>
      </div>

      {/* Player & Playlist Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Active Player Deck */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-purple-200 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between space-y-3.5">
          {/* Top Banner Artwork - Compact Height */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-36 sm:h-44 shadow-xs bg-purple-900 group">
            <img
              src={selectedStory.coverImage}
              alt={selectedStory.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-3.5 sm:p-4">
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 rounded-full bg-purple-400 text-purple-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                  {selectedStory.narrator}
                </span>
                <h3 className="text-base sm:text-xl font-black text-white filter drop-shadow">
                  {language === 'hi' ? selectedStory.titleHi : selectedStory.titleEn}
                </h3>
              </div>
            </div>

            {/* Sound Wave Animation when Playing */}
            {isPlaying && (
              <div className="absolute top-2.5 right-2.5 flex items-end gap-1 bg-black/50 backdrop-blur-xs px-2 py-1 rounded-lg border border-white/20">
                <span className="w-1 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-rose-400 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-150" />
                <span className="w-1 h-5 bg-sky-400 rounded-full animate-pulse delay-200" />
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {language === 'hi' ? selectedStory.descriptionHi : selectedStory.descriptionEn}
          </p>

          {/* Timeline & Scrubber */}
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={duration || 180}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-purple-100 rounded-lg"
            />
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || 180)}</span>
            </div>
          </div>

          {/* Primary Audio Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 pt-2">
            <button
              onClick={() => handleSkip(-10)}
              title="Rewind 10s"
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              id="audio-main-play-btn"
              onClick={handleTogglePlay}
              className="w-16 h-16 rounded-3xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(10)}
              title="Forward 10s"
              className="p-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Calming Bedtime Utilities: Sleep Timer & Ambient Melody */}
          <div className="pt-4 border-t border-purple-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Ambient melody generator */}
            <button
              onClick={handleToggleAmbient}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all border ${
                ambientLullaby
                  ? 'bg-purple-700 text-white border-purple-800 animate-pulse'
                  : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>
                {ambientLullaby
                  ? language === 'hi'
                    ? 'शांत संगीत चालू 🎵'
                    : 'Calm Music On 🎵'
                  : language === 'hi'
                  ? 'धीमा शांत संगीत (Ambient)'
                  : 'Soft Background Music'}
              </span>
            </button>

            {/* Timer dropdown pills */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">{language === 'hi' ? 'ऑटो टाइमर:' : 'Auto Timer:'}</span>
              </span>
              {[null, 5, 15, 30].map((mins) => (
                <button
                  key={mins === null ? 'off' : mins}
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setSleepTimerMinutes(mins);
                  }}
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    sleepTimerMinutes === mins
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mins === null ? 'Off' : `${mins}m`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Playlist Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <Headphones className="w-4 h-4 text-purple-600" />
              <span>{language === 'hi' ? 'ऑडियो कहानियों की सूची' : 'Story Audio Playlist'}</span>
            </h3>
            <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              {audioStories.length} Tracks
            </span>
          </div>

          <div className="space-y-2.5">
            {audioStories.map((story) => {
              const isCurrent = selectedStory.id === story.id;
              return (
                <div
                  key={story.id}
                  id={`audio-item-${story.id}`}
                  onClick={() => {
                    if (soundEnabled) playPopSound();
                    setSelectedStory(story);
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 select-none ${
                    isCurrent
                      ? 'bg-purple-50 border-purple-500 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={story.coverImage}
                    alt={story.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`text-xs sm:text-sm font-extrabold line-clamp-1 ${
                        isCurrent ? 'text-purple-950' : 'text-slate-800'
                      }`}
                    >
                      {language === 'hi' ? story.titleHi : story.titleEn}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{story.narrator}</span>
                      <span>•</span>
                      <span>{story.duration}</span>
                    </div>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isCurrent ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

