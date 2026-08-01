import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, Volume2, VolumeX, Repeat, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface SoundtrackPlayerProps {
  url?: string;
  title?: string;
  artist?: string;
  autoPlay?: boolean;
}

export const SoundtrackPlayer: React.FC<SoundtrackPlayerProps> = ({
  url = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-114476.mp3',
  title = 'A Thousand Silent Moments',
  artist = 'Romantic Piano Solo',
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(true);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isMuted, isLooping]);

  // Handle autoplay signal when vault is unlocked or autoPlay prop changes
  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasPrompted(false);
          })
          .catch((err) => {
            console.log('Autoplay deferred until user interaction:', err);
          });
      }
    }
  }, [autoPlay, url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasPrompted(false);
        })
        .catch((err) => {
          console.log('Audio autoplay blocked or failed:', err);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(e.target.value);
    setProgress(newProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (!isLooping) setIsPlaying(false);
        }}
      />

      <AnimatePresence>
        {/* Initial Polite Floating Prompt */}
        {hasPrompted && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 p-3.5 bg-rose-950/85 backdrop-blur-xl border border-rose-400/30 rounded-2xl shadow-2xl text-white max-w-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-500/20 rounded-xl text-rose-300 animate-pulse">
                <Music className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-rose-100 flex items-center gap-1">
                  Play our soundtrack? <Sparkles className="w-3 h-3 text-rose-300 inline" />
                </p>
                <p className="text-rose-300/80 text-[11px] truncate">{title}</p>
              </div>
            </div>
            <button
              onClick={togglePlay}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
            >
              <Play className="w-3 h-3 fill-white" /> Listen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Audio Control Pill */}
      <motion.div
        layout
        className="glass-card-dark rounded-full border border-rose-400/20 shadow-2xl overflow-hidden backdrop-blur-2xl text-white"
      >
        <div className="p-2.5 flex items-center gap-3">
          {/* Animated Disk / Equalizer Icon */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shrink-0 shadow-inner group cursor-pointer"
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-white rounded-full animate-bounce h-3" style={{ animationDuration: '0.6s' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-4" style={{ animationDuration: '0.9s' }} />
                <span className="w-1 bg-white rounded-full animate-bounce h-2" style={{ animationDuration: '0.4s' }} />
              </div>
            ) : (
              <Music className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Title & Artist */}
          <div className="hidden sm:block text-left pr-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <p className="text-xs font-semibold text-rose-100 truncate max-w-[140px]">{title}</p>
            <p className="text-[10px] text-rose-300/70 truncate max-w-[140px]">{artist}</p>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer active:scale-95"
            aria-label={isPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-rose-300/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Controls Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-3 pt-1 border-t border-white/10 space-y-2.5 text-xs text-rose-200/90"
            >
              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-rose-500 h-1 bg-rose-950/60 rounded-lg cursor-pointer"
                />
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setIsMuted(false);
                      setVolume(Number(e.target.value));
                    }}
                    className="w-16 accent-rose-400 h-1 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isLooping ? 'text-rose-400 bg-rose-500/20' : 'text-rose-300/60 hover:text-white'
                  }`}
                  title={isLooping ? 'Looping enabled' : 'Loop disabled'}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
