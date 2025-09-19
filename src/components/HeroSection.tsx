import React from 'react';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/hero-background.jpg';

interface HeroSectionProps {
  onStartQuiz: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartQuiz }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroBackground})`,
          filter: 'blur(1px) opacity(0.3)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent leading-tight">
          Find your perfect<br />
          <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            data match
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Stop ghosting your data, start a real relationship.
        </p>
        
        <Button 
          size="lg" 
          onClick={onStartQuiz}
          className="text-lg px-8 py-4 h-auto bg-white text-gray-900 hover:bg-white/90 hover:scale-105 shadow-2xl"
        >
          Start swiping ❤️
        </Button>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💕</div>
        <div className="absolute top-32 right-16 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>📊</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{ animationDelay: '2s' }}>🔍</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-pulse">
        <div className="text-sm mb-2">Scroll to start</div>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto">
          <div className="w-1 h-2 bg-white/70 rounded-full mx-auto mt-2 animate-pulse" />
        </div>
      </div>
    </div>
  );
};