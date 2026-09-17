'use client';

import React, { useMemo } from 'react';
import { useEditorStore } from '../../../store/useEditorStore';
import { Music } from 'lucide-react';
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

function RenderMediaPreview({ url }) {
  if (!url) return null;

  const cleanUrl = url.split('?')[0].toLowerCase();

  const isVideo = cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v)$/i) || url.includes('/video/');
  const isAudio = cleanUrl.match(/\.(mp3|wav|ogg|aac|m4a|flac)$/i) || url.includes('/audio/');

  if (isVideo) {
    return (
      <video
        src={url}
        controls
        className="w-full h-full object-contain bg-black/5"
      />
    );
  }

  if (isAudio) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 rounded-sm">
        <Music className="w-8 h-8 text-slate-500 mb-2" />
        <audio src={url} controls className="w-full max-w-xs" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Media Content"
      className="w-full h-full object-contain"
    />
  );
}

export default function CoursePresentationView({ sectionId, section: passedSection, data: passedData, brandColor: passedBrandColor, onPrev, onNext }) {
  const storeBrandColor = useEditorStore((state) => state.brandColor);
  const sections = useEditorStore((state) => state.sections) || [];
  const section = useEditorStore((state) =>
    state.sections.find((s) => s.id === sectionId)
  );

  const coverSection = useMemo(() => {
    return sections.find(
      (s) => s.id === 'root-cover-page' || s.contentType === 'cover_page' || s.type === 'cover'
    );
  }, [sections]);

  const coverData = coverSection?.data || {};
  const data = passedData || section?.data || {};

  const brandColor =
    passedBrandColor ||
    storeBrandColor ||
    data.brandColor ||
    coverData.brandColor ||
    '#1a688a';

  const rawBgImage =
    data.backgroundImage ||
    data.coverBackgroundUrl ||
    coverData.backgroundUrl ||
    coverData.bgImage ||
    '';

  const bgTint = data.backgroundTint || `${brandColor}cc`;

  const bgImageUrl = typeof rawBgImage === 'object' && rawBgImage !== null
    ? (rawBgImage.url || rawBgImage.src || '')
    : String(rawBgImage || '');

  const calculatedTextColor = useMemo(() => getContrastColor(bgTint), [bgTint]);
  const titleTextColor = useMemo(() => getContrastColor(brandColor), [brandColor]);

  const currentTemplate = data.template || 'title_subtitle';
  const title = data.title || '';
  const subtitle = data.subtitle || '';

  const body = data.body || '';
  const bodyType = data.bodyType || 'text';
  const bodyImage = data.bodyImage || '';

  const bodyLeft = data.bodyLeft || '';
  const bodyLeftType = data.bodyLeftType || 'text';
  const bodyLeftImage = data.bodyLeftImage || '';

  const bodyRight = data.bodyRight || '';
  const bodyRightType = data.bodyRightType || 'text';
  const bodyRightImage = data.bodyRightImage || '';

  const isLeftAligned = currentTemplate === 'title_body' || currentTemplate === 'title_two_columns';
  const source = [passedSection?.source, section?.source, data.source]
    .find((value) => typeof value === 'string' && value.trim()) || '';

  return (
    <SourceHoverTarget source={source} className="pointer-events-auto w-[1280px] h-[720px] shrink-0 flex flex-col justify-between font-sans overflow-hidden relative border border-slate-200 rounded-sm shadow-inner mx-auto isolate p-0 box-border">
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
        className="absolute inset-0 w-full h-full z-10 pointer-events-none transition-colors duration-300 opacity-65"
        style={{ backgroundColor: bgTint }}
      />

      {/* Main Content Container with scoped padding */}
      <div className="w-full flex-1 z-20 flex flex-col min-h-0 pt-20 px-12 pb-4">
        
        {/* Main Content Layout Stack */}
        <div className={`w-full flex-1 flex flex-col min-h-0 ${
          isLeftAligned ? 'justify-start items-start gap-3 text-left' : 'max-w-4xl mx-auto justify-center items-center text-center gap-6'
        }`}>
          {/* Title */}
          <div className={`w-full ${isLeftAligned ? 'text-left' : 'text-center'}`}>
            <h1
              className={`w-full font-black tracking-tight font-sans ${
                isLeftAligned ? 'text-3xl lg:text-4xl text-left' : 'text-4xl sm:text-5xl text-center'
              }`}
              style={{ color: titleTextColor }}
            >
              <BoldText>{title}</BoldText>
            </h1>
          </div>

          {/* Subtitle */}
          {currentTemplate === 'title_subtitle' && subtitle && (
            <div className="w-full max-w-2xl">
              <h2
                className="w-full text-xl sm:text-2xl font-semibold text-center font-sans leading-relaxed drop-shadow-lg"
                style={{ color: calculatedTextColor }}
              >
                <BoldText>{subtitle}</BoldText>
              </h2>
            </div>
          )}

          {/* Title and Body Variant */}
          {currentTemplate === 'title_body' && (
            <div className="w-full flex-1 mt-1 relative flex flex-col min-h-0 overflow-hidden">
              {bodyType === 'text' ? (
                <div className="w-full h-full p-2 overflow-y-auto">
                  <p
                    className="w-full text-xl lg:text-2xl font-normal text-left font-sans whitespace-pre-wrap leading-relaxed"
                    style={{ color: calculatedTextColor }}
                  >
                    <BoldText>{body}</BoldText>
                  </p>
                </div>
              ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-50/50 border border-slate-200/50 rounded-sm overflow-hidden">
                  <RenderMediaPreview url={bodyImage} />
                </div>
              )}
            </div>
          )}

          {/* Title and 2 Columns Variant */}
          {currentTemplate === 'title_two_columns' && (
            <div className="w-full flex-1 grid grid-cols-2 gap-6 mt-1 min-h-0 overflow-hidden">
              {/* Left Column */}
              <div className="relative flex flex-col min-h-0 h-full overflow-hidden">
                {bodyLeftType === 'text' ? (
                  <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-sm shadow-lg overflow-y-auto">
                    <p
                      className="w-full text-xl lg:text-2xl font-normal text-left font-sans whitespace-pre-wrap leading-relaxed"
                      style={{ color: calculatedTextColor }}
                    >
                      <BoldText>{bodyLeft}</BoldText>
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center bg-slate-50/50 border border-slate-200/50 rounded-sm overflow-hidden">
                    <RenderMediaPreview url={bodyLeftImage} />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="relative flex flex-col min-h-0 h-full overflow-hidden">
                {bodyRightType === 'text' ? (
                  <div className="w-full h-full bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-sm shadow-lg overflow-y-auto">
                    <p
                      className="w-full text-xl lg:text-2xl font-normal text-left font-sans whitespace-pre-wrap leading-relaxed"
                      style={{ color: calculatedTextColor }}
                    >
                      <BoldText>{bodyRight}</BoldText>
                    </p>
                  </div>
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center bg-slate-50/50 border border-slate-200/50 rounded-sm overflow-hidden">
                    <RenderMediaPreview url={bodyRightImage} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Unpadded Edge-to-Edge Navigation Footer Container */}
      <div className="w-full z-40 relative shrink-0 p-0 m-0">
        <NavigationFooter 
          onPrev={onPrev} 
          onNext={onNext} 
        />
      </div>
    </SourceHoverTarget>
  );
}