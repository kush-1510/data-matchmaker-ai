import React, { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { DataMatchQuiz } from '@/components/DataMatchQuiz';
import { Footer } from '@/components/Footer';

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    // Smooth scroll to quiz section
    setTimeout(() => {
      const quizElement = document.getElementById('quiz-section');
      if (quizElement) {
        quizElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onStartQuiz={handleStartQuiz} />
      
      {showQuiz && (
        <section id="quiz-section" className="py-16 px-6">
          <div className="container mx-auto">
            <DataMatchQuiz />
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
