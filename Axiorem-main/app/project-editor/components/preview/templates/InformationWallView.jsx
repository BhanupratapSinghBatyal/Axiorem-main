'use client';

import React, { useMemo, useState } from 'react';
import NavigationFooter from '../../NavigationFooter';
import { SourceHoverTarget } from '../SourceTooltip';
import BoldText from '../BoldText';

function getContrastColor(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') {
    return '#ffffff';
  }

  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance < 0.35 ? '#ffffff' : '#0f172a';
}

function getValidImageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    return new URL(value).href;
  } catch {
    return null;
  }
}

export default function InformationWallView({ title, section, data = {}, onPrev, onNext }) {
  const brandColor = data.brandColor || '#1a688a';
  const sectionTitle = title || data.sectionTitle || data.title || '';
  const headline = data.headline || '';
  const panels = data.panels || data.items || [];
  const [failedMedia, setFailedMedia] = useState(() => new Set());

  const rawBgImage =
    data.backgroundImage ||
    data.coverBackgroundUrl ||
    data.bgImage ||
    '';

  const bgTint = data.backgroundTint || `${brandColor}cc`;

  const bgImageUrl = typeof rawBgImage === 'object' && rawBgImage !== null
    ? (rawBgImage.url || rawBgImage.src || '')
    : String(rawBgImage || '');

  const calculatedTextColor = useMemo(() => getContrastColor(bgTint), [bgTint]);
  const titleTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  return (
    <SourceHoverTarget source={section?.source} className="@container w-full h-full font-sans overflow-y-auto overflow-x-hidden isolate custom-scrollbar">
      <div className="relative w-full max-w-[1280px] mx-auto min-h-full flex flex-col font-sans rounded-none overflow-hidden transition-all duration-300 isolate">
        
        {/* Layer 1: Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 pointer-events-none"
          style={{
            backgroundImage: bgImageUrl ? `url("${bgImageUrl}")` : 'none',
            backgroundColor: '#0f172a',
          }}
        />

        {/* Layer 2: Tint Overlay */}
        <div
          className="absolute inset-0 w-full h-full z-10 pointer-events-none transition-colors duration-300"
          style={{ backgroundColor: bgTint }}
        />

        {/* Layer 3: Main Content Section */}
        <section className="relative z-20 w-full p-[3cqw] flex-1 font-sans">
          <div className="w-full flex flex-col gap-[2.5cqw]">
            
            {/* Header */}
            <header className="w-full max-w-[800px] mx-auto text-center flex flex-col items-center gap-[1cqw]">
              {sectionTitle && (
                <div className="relative inline-block w-full">
                  <h1
                    className="w-full text-center font-extrabold tracking-tight leading-tight text-[clamp(1.5rem,3.2cqw,2.75rem)]"
                    style={{ color: titleTextColor }}
                  >
                    <BoldText>{sectionTitle}</BoldText>
                  </h1>
                  <div
                    className="mx-auto mt-[0.5cqw] h-[0.3cqw] min-h-[3px] w-[8cqw] min-w-[48px] rounded-none transition-colors duration-300"
                    style={{ backgroundColor: titleTextColor }}
                  />
                </div>
              )}

              {headline && (
                <p
                  className="w-full text-center font-medium text-[clamp(0.875rem,1.6cqw,1.25rem)]"
                  style={{ color: calculatedTextColor }}
                >
                  <BoldText>{headline}</BoldText>
                </p>
              )}
            </header>

            {/* Panel Stream */}
            <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-[4cqw]">
              {panels.length > 0 ? (
                panels.map((panel, index) => {
                  const isEven = index % 2 === 0;
                  const resolvedMediaUrl = getValidImageUrl(panel.imageUrl || panel.mediaUrl || panel.image);
                  const mediaKey = `${panel.id || index}:${resolvedMediaUrl || ''}`;
                  const hasMedia = Boolean(resolvedMediaUrl) && !failedMedia.has(mediaKey);

                  return (
                    <SourceHoverTarget as="article" key={panel.id || index} source={panel.source} className="w-full group relative">
                      <div
                        className={`w-full flex flex-col @2xl:flex-row items-center gap-[2.5cqw] transition-all duration-300 relative ${
                          isEven ? '@2xl:flex-row' : '@2xl:flex-row-reverse'
                        }`}
                      >
                        {/* Media Node */}
                        {hasMedia && (
                          <div className="w-full @2xl:w-1/2 aspect-[4/3] rounded-md overflow-hidden bg-slate-900/5 border border-white/20 shadow-2xl relative flex items-center justify-center shrink-0">
                            <div className="w-full h-full relative group/img">
                              <img
                                src={resolvedMediaUrl}
                                alt={panel.altText || 'Panel preview'}
                                onError={() => setFailedMedia((current) => new Set(current).add(mediaKey))}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                              />
                            </div>
                          </div>
                        )}

                        {/* Content Fields */}
                        <div className={`w-full ${hasMedia ? '@2xl:w-1/2' : ''} flex flex-col justify-center gap-[1cqw]`}>
                          {panel.title && (
                            <h2
                              className="w-full font-extrabold tracking-tight leading-tight text-left text-[clamp(1.25rem,2.4cqw,1.875rem)]"
                              style={{ color: calculatedTextColor }}
                            >
                              <BoldText>{panel.title}</BoldText>
                            </h2>
                          )}

                          {panel.infoText && (
                            <p
                              className="w-full font-normal leading-relaxed whitespace-pre-wrap text-left opacity-90 text-[clamp(0.75rem,1.3cqw,1rem)]"
                              style={{ color: calculatedTextColor }}
                            >
                              <BoldText>{panel.infoText}</BoldText>
                            </p>
                          )}
                        </div>
                      </div>
                    </SourceHoverTarget>
                  );
                })
              ) : (
                <div
                  className="py-[4cqw] text-center font-medium opacity-80 border-2 border-dashed border-white/20 rounded-3xl text-[clamp(0.75rem,1.2cqw,0.875rem)]"
                  style={{ color: calculatedTextColor }}
                >
                  No panels present in layout.
                </div>
              )}
            </div>

            {/* Brand Accent Line */}
            <div
              className="w-full h-[0.25cqw] min-h-[2px] rounded-full shrink-0 mt-[2cqw]"
              style={{ backgroundColor: brandColor }}
            />
          </div>
        </section>

        {/* Footer Container */}
        <footer className="relative z-20 w-full shrink-0">
          <NavigationFooter onPrev={onPrev} onNext={onNext} />
        </footer>
      </div>
    </SourceHoverTarget>
  );
}