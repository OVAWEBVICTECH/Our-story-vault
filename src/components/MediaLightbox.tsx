import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, MapPin, Calendar, Tag, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Memory } from '../types/index.js';

interface MediaLightboxProps {
  memory: Memory | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  memory,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  const resetZoom = () => setZoomLevel(1);

  if (!memory) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl"
    >
        {/* Background Click Close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] glass-card-dark rounded-3xl border border-rose-500/30 overflow-hidden flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Control Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {memory.mediaType === 'image' && (
              <>
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-lg"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Media View Column */}
          <div className="relative flex-1 bg-black/80 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[450px]">
            {memory.mediaType === 'video' ? (
              <video
                src={memory.mediaUrl}
                controls
                autoPlay
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            ) : (
              <motion.img
                src={memory.mediaUrl}
                alt={memory.title}
                animate={{ scale: zoomLevel }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onDoubleClick={zoomLevel > 1 ? resetZoom : handleZoomIn}
                className="max-h-[70vh] w-auto object-contain cursor-zoom-in rounded-xl select-none"
              />
            )}

            {/* Navigation Arrows */}
            {hasPrev && (
              <button
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer z-20 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer z-20 shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Metadata Sidebar Column */}
          <div className="w-full md:w-80 p-6 flex flex-col justify-between space-y-4 bg-rose-950/70 border-t md:border-t-0 md:border-l border-rose-500/20 text-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>{memory.date}</span>
                {memory.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{memory.location}</span>
                  </>
                )}
              </div>

              <h3 className="text-2xl font-bold text-rose-100 leading-snug">{memory.title}</h3>

              <p className="text-sm text-rose-200/90 leading-relaxed font-light whitespace-pre-line">{memory.caption}</p>

              {/* Memory Tags */}
              {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {memory.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 font-medium"
                    >
                      <Tag className="w-3 h-3 text-rose-300" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[11px] text-rose-300/60 text-center italic border-t border-white/10 pt-3">
              Double click or pinch photo to zoom in
            </p>
          </div>
        </motion.div>
      </motion.div>
  );
};
