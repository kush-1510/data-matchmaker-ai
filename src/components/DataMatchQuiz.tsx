import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Linkedin, Twitter, RotateCcw } from 'lucide-react';
import XIcon from '../assets/x-icon.png';

interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  showSwipeCards: boolean;
  currentCard: number;
  showResult: boolean;
  showLeadForm: boolean;
  selectedMatch: string | null;
  isTransitioning: boolean;
  slideDirection: 'in' | 'out' | 'none';
  resultVisible: boolean;
  cardSwipeDirection: 'left' | 'right' | 'none';
  isCardAnimating: boolean;
}

interface LeadFormData {
  name: string;
  email: string;
  company: string;
  role: string;
}

const questions = [
  {
    text: "What ruins your week most often?",
    options: [
      { text: "A 3 a.m. pipeline alert (again)", subtitle: "" },
      { text: "Another \"AI experiment\" nobody approved", subtitle: "" },
      { text: "Dashboards that all tell a different story", subtitle: "" },
      { text: "Chasing missing context like it's a crime scene", subtitle: "" }
    ]
  },
  {
    text: "What do you want most in a partner?",
    options: [
      { text: "Reliability, no surprises", subtitle: "" },
      { text: "Context that's actually useful", subtitle: "" },
      { text: "Metadata that works as hard as I do", subtitle: "" },
      { text: "AI-ready from day one", subtitle: "" }
    ]
  },
  {
    text: "Biggest red flag?",
    options: [
      { text: "Ghosts you during audits", subtitle: "" },
      { text: "Shows up late with broken pipelines", subtitle: "" },
      { text: "Secretive, never shares lineage", subtitle: "" },
      { text: "Swears they're \"AI-ready\" but breaks at scale", subtitle: "" }
    ]
  }
];

const results = [
  {
    id: 'pipeline',
    emoji: '💔',
    title: 'Unreliable Pipeline',
    age: '5 years old, but feels like 50',
    description: 'Always late, never commits. Loves breaking right before exec reviews. Swipe right if you enjoy 3 a.m. alerts and trust issues.',
    ctaText: 'See how Atlan fixes this',
    ctaUrl: 'https://atlan.com/regovern/?ref=/regovern-quiz'
  },
  {
    id: 'shadow-ai',
    emoji: '👻',
    title: 'Shadow AI Model',
    age: 'Unknown',
    description: "I move fast and break compliance. Big fan of secrets, hate documentation.\nI'll ghost you during audits but look amazing in demos.",
    ctaText: 'See how Atlan brings models into the light',
    ctaUrl: 'https://atlan.com/regovern/?ref=/regovern-quiz'
  },
  {
    id: 'data-quality',
    emoji: '✅',
    title: 'Data Quality',
    age: 'Mature, dependable',
    description: 'Low drama, high standards. Gets overlooked, but always there when you need me. Ready for a long-term relationship, if you\'ll just notice me.',
    ctaText: 'See how Atlan makes quality everyone\'s job',
    ctaUrl: 'https://atlan.com/regovern/?ref=/regovern-quiz'
  },
  {
    id: 'atlan',
    emoji: '💙',
    title: 'Atlan',
    age: 'Timeless',
    description: 'Transparent, reliable, AI-ready. Context is my love language. I\'ll never ghost you, and your board will love me. Let\'s build something real.',
    ctaText: 'Find a healthier relationship at Re:Govern',
    ctaUrl: 'https://atlan.com/regovern/?ref=/regovern-quiz'
  }
];

export const DataMatchQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizState>({
    currentQuestion: 0,
    answers: [null, null, null],
    showSwipeCards: false,
    currentCard: 0,
    showResult: false,
    showLeadForm: false,
    selectedMatch: null,
    isTransitioning: false,
    slideDirection: 'none',
    resultVisible: false,
    cardSwipeDirection: 'none',
    isCardAnimating: false
  });

  const [leadForm, setLeadForm] = useState<LeadFormData>({
    name: '',
    email: '',
    company: '',
    role: ''
  });

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...quiz.answers];
    newAnswers[quiz.currentQuestion] = answerIndex;
    
    // Start slide-out transition
    setQuiz({
      ...quiz,
      answers: newAnswers,
      isTransitioning: true,
      slideDirection: 'out'
    });
    
    // After slide-out animation, update question and slide-in
    setTimeout(() => {
      if (quiz.currentQuestion < questions.length - 1) {
        // Update to next question and start slide-in from right
        setQuiz({
          ...quiz,
          answers: newAnswers,
          currentQuestion: quiz.currentQuestion + 1,
          slideDirection: 'in'
        });
        
        // Complete slide-in animation
        setTimeout(() => {
          setQuiz(prev => ({
            ...prev,
            isTransitioning: false,
            slideDirection: 'none'
          }));
        }, 50); // Small delay to ensure slide-in starts from right
        
      } else {
        setQuiz({
          ...quiz,
          answers: newAnswers,
          showSwipeCards: true,
          isTransitioning: false,
          slideDirection: 'none'
        });
      }
    }, 300); // 300ms slide-out duration
  };

  const handleCardChoice = (choice: 'skip' | 'choose') => {
    // Start swipe animation
    setQuiz({
      ...quiz,
      cardSwipeDirection: choice === 'skip' ? 'left' : 'right',
      isCardAnimating: true
    });

    // After swipe animation, handle the logic
    setTimeout(() => {
      if (choice === 'choose') {
        setQuiz({
          ...quiz,
          selectedMatch: results[quiz.currentCard].id,
          showResult: true,
          cardSwipeDirection: 'none',
          isCardAnimating: false
        });
        // Trigger fade-in animation after a small delay
        setTimeout(() => {
          setQuiz(prev => ({
            ...prev,
            resultVisible: true
          }));
        }, 100);
      } else {
        // Skip to next card
        if (quiz.currentCard < results.length - 1) {
          setQuiz({
            ...quiz,
            currentCard: quiz.currentCard + 1,
            cardSwipeDirection: 'none',
            isCardAnimating: false
          });
        } else {
          // If they've skipped all cards, show Atlan as default
          setQuiz({
            ...quiz,
            selectedMatch: 'atlan',
            showResult: true,
            cardSwipeDirection: 'none',
            isCardAnimating: false
          });
          // Trigger fade-in animation after a small delay
          setTimeout(() => {
            setQuiz(prev => ({
              ...prev,
              resultVisible: true
            }));
          }, 100);
        }
      }
    }, 700); // 700ms for swipe animation
  };

  const getResult = () => {
    if (quiz.selectedMatch) {
      return results.find(r => r.id === quiz.selectedMatch) || results[3];
    }
    
    const answers = quiz.answers;
    
    // Simple logic to determine result based on answers
    if (answers[0] === 2) return results[0]; // Pipeline issues
    if (answers[0] === 3 || answers[2] === 3) return results[1]; // Shadow AI
    if (answers[1] === 3) return results[3]; // Atlan (all of the above)
    return results[2]; // Data Quality
  };

  const resetQuiz = () => {
    setQuiz({
      currentQuestion: 0,
      answers: [null, null, null],
      showSwipeCards: false,
      currentCard: 0,
      showResult: false,
      showLeadForm: false,
      selectedMatch: null,
      isTransitioning: false,
      slideDirection: 'none',
      resultVisible: false,
      cardSwipeDirection: 'none',
      isCardAnimating: false
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = "I just found my perfect data match! Take the quiz to find yours.";

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const submitLeadForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Lead form submitted:', leadForm);
    setQuiz({ ...quiz, showLeadForm: false });
  };

  if (quiz.showResult) {
    const result = getResult();
    
    return (
      <div className={`max-w-2xl mx-auto space-y-8 transition-all duration-700 ease-out ${
        quiz.resultVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
      }`}>
        <Card className="p-8 text-center shadow-card-hover border-2">
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent font-heading">
            {result.title}
          </h2>
          {result.age && (
            <p className="text-lg text-muted-foreground mb-4">Age: {result.age}</p>
          )}
          <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">{result.description}</p>
          
          <div className="space-y-4">
            <Button size="lg" onClick={() => window.open(result.ctaUrl, '_blank')}>
              {result.ctaText}
            </Button>
          </div>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button variant="linkedin" onClick={shareOnLinkedIn}>
            <Linkedin className="w-4 h-4 mr-2" />
            Share on LinkedIn
          </Button>
          <Button variant="twitter" onClick={shareOnTwitter}>
            <img src={XIcon} alt="X icon" className="w-6 h-6 mr-1" />
            Share on X
          </Button>
        </div>

        <div className="text-center">
          <a 
            href="https://atlan.com/regovern/?ref=/regovern-quiz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Join us at Re:Govern →
          </a>
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={resetQuiz}>
            <RotateCcw className="w-6 h-6 mr-1" />
            Take Quiz Again
          </Button>
        </div>
      </div>
    );
  }

  // Swipe Cards Section
  if (quiz.showSwipeCards) {
    const currentCard = results[quiz.currentCard];
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent font-heading">
            Your potential matches
          </h2>
          <p className="text-muted-foreground">
            Card {quiz.currentCard + 1} of {results.length}
          </p>
        </div>

        <Card className={`p-8 text-center shadow-card-hover border-2 bg-gradient-to-br from-background to-muted/20 transition-all duration-700 ease-in-out ${
          quiz.cardSwipeDirection === 'left' ? 'transform -translate-x-full -rotate-12 opacity-0' :
          quiz.cardSwipeDirection === 'right' ? 'transform translate-x-full rotate-12 opacity-0' :
          'transform translate-x-0 rotate-0 opacity-100'
        }`}>
          <div className="text-6xl mb-4">{currentCard.emoji}</div>
          <h3 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent font-heading">
            {currentCard.title}
          </h3>
          <p className="text-lg text-muted-foreground mb-4">Age: {currentCard.age}</p>
          <p className="text-lg text-muted-foreground mb-8 whitespace-pre-line leading-relaxed">
            {currentCard.description}
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => handleCardChoice('skip')}
              className="px-8"
              disabled={quiz.isCardAnimating}
            >
              ❌ Skip
            </Button>
            <Button 
              size="lg"
              onClick={() => handleCardChoice('choose')}
              className="px-8 bg-gradient-primary"
              disabled={quiz.isCardAnimating}
            >
              ❤️ Choose
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = questions[quiz.currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {quiz.currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(((quiz.currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${((quiz.currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className={`p-8 shadow-card-hover transition-all duration-300 ease-in-out ${
        quiz.slideDirection === 'out' ? 'transform translate-x-full opacity-0' :
        quiz.slideDirection === 'in' ? 'transform -translate-x-full opacity-0' :
        'transform translate-x-0 opacity-100'
      }`}>
        <h2 className="text-2xl font-bold mb-8 text-center font-heading">{currentQ.text}</h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant="quiz"
              className="w-full p-6 h-auto text-left justify-start transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
              onClick={() => handleAnswer(index)}
              disabled={quiz.isTransitioning}
            >
              <div>
                <div className="font-medium">{option.text}</div>
                {option.subtitle && (
                  <div className="text-sm text-muted-foreground mt-1">{option.subtitle}</div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};