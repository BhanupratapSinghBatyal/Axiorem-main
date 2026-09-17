import React from 'react';
import NavigationFooter from '../../NavigationFooter';
import { SourceHoverTarget } from '../SourceTooltip';
import BoldText from '../BoldText';

export default function CoverPageView({ title, section, data = {}, brandColor: propBrandColor, onPrev, onNext }) {
  const subheadingText = data.candidateInstructions || data.subheading || "";
  const logoUrl = data.logoUrl || "";
  const backgroundUrl = data.backgroundUrl || "";
  const brandColor = propBrandColor || data.brandColor || "#1a688a";

  return (
    <SourceHoverTarget source={section?.source} className="w-[1280px] h-[720px] shrink-0 flex flex-col font-sans overflow-hidden relative border border-slate-200 rounded-sm shadow-inner bg-slate-900 mx-auto z-100">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundUrl && (
          <img 
            src={backgroundUrl} 
            alt="Course Background" 
            className="w-full h-full object-cover select-none pointer-events-none"
          />
        )}
        <div 
          className="absolute inset-0 z-10 pointer-events-none transition-colors duration-300" 
          style={{ backgroundColor: brandColor, opacity: 0.65 }} 
        />
      </div>

      {/* Top Left Logo Display */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-5">
        <div className="h-16 flex items-center">
          {logoUrl && (
            <div className="relative h-full max-w-[240px] flex items-center px-4 py-2 rounded-sm">
              <img 
                src={logoUrl} 
                alt="Company Logo" 
                className="max-h-full object-contain" 
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Structural Stage Layout */}
      <div className="relative flex-1 w-full z-20 flex flex-col justify-between pt-28">
        
        {/* Full Width Banner Title Container */}
        <div className="w-full mt-4 bg-white/95 backdrop-blur-md border-y border-white/40 shadow-2xl py-8 sm:py-10 px-8 sm:px-16 flex justify-center transition-all duration-150">
          <div className="w-full max-w-4xl flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center">
              <h1 className="w-full text-center text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight bg-transparent border-b-2 border-slate-200 pb-3 whitespace-pre-wrap break-words">
                <BoldText>{title || "Enter Content Title..."}</BoldText>
              </h1>
              <div 
                className="h-[3px] transition-all duration-300 mt-[-3px]" 
                style={{ backgroundColor: brandColor, width: title ? '100%' : '0%' }} 
              />
            </div>
          </div>
        </div>

        {/* 3/4 Height Subtitle Area */}
        <div className="w-full flex justify-center my-auto pt-8 px-8">
          <div className="w-full max-w-3xl px-6 flex flex-col items-center">
            {subheadingText && (
              <p className="w-full text-center text-xl sm:text-2xl font-semibold leading-relaxed p-3 bg-transparent border-none text-white drop-shadow-md whitespace-pre-wrap break-words">
                <BoldText>{subheadingText}</BoldText>
              </p>
            )}
          </div>
        </div>

        {/* Integrated Navigation Footer */}
        <div className="w-full z-40">
          <NavigationFooter 
            onPrev={onPrev} 
            onNext={onNext} 
          />
        </div>

      </div>

    </SourceHoverTarget>
  );
}