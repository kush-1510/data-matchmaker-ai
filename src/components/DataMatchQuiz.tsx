import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, Linkedin, Twitter, RotateCcw, X } from 'lucide-react';
import XIcon from '../assets/x-icon.png';

// TypeScript declarations for HubSpot and Google Analytics
declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region: string;
          portalId: string;
          formId: string;
          target: string;
          onFormReady?: () => void;
          onFormSubmit?: () => void;
          onFormSubmitted?: () => void;
        }) => void;
      };
    };
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | object,
      config?: object
    ) => void;
  }
}

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
  showHubSpotModal: boolean;
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
    isCardAnimating: false,
    showHubSpotModal: false
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
    
    // Track quiz answer
    trackEvent('quiz_answer', {
      question_number: quiz.currentQuestion + 1,
      answer_index: answerIndex,
      answer_text: questions[quiz.currentQuestion].options[answerIndex].text,
      quiz_progress: `${quiz.currentQuestion + 1}/${questions.length}`
    });
    
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
    // Track card swipe action
    trackEvent('card_swipe', {
      action: choice,
      card_title: results[quiz.currentCard].title,
      card_position: quiz.currentCard + 1,
      total_cards: results.length
    });
    
    // Start swipe animation
    setQuiz({
      ...quiz,
      cardSwipeDirection: choice === 'skip' ? 'left' : 'right',
      isCardAnimating: true
    });

    // After swipe animation, handle the logic
    setTimeout(() => {
      if (choice === 'choose') {
        // Track quiz completion
        trackEvent('quiz_complete', {
          selected_match: results[quiz.currentCard].id,
          match_title: results[quiz.currentCard].title,
          completion_method: 'card_selection'
        });
        
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
        trackEvent('quiz_complete', {
          selected_match: 'atlan',
          match_title: 'Atlan',
          completion_method: 'skipped_all_cards'
        });
        
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
    // Track quiz reset
    trackEvent('quiz_reset', {
      previous_result: quiz.selectedMatch || 'unknown',
      source: 'results_page'
    });
    
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
      isCardAnimating: false,
      showHubSpotModal: false
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = "I just found my perfect data match! Take the quiz to find yours.";

  const shareOnLinkedIn = () => {
    // Track LinkedIn share click
    trackEvent('share_linkedin', {
      quiz_result: getResult().id,
      share_platform: 'linkedin'
    });
    
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnTwitter = () => {
    // Track Twitter share click
    trackEvent('share_twitter', {
      quiz_result: getResult().id,
      share_platform: 'twitter'
    });
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  // Google Analytics tracking function
  const trackEvent = (eventName: string, parameters?: object) => {
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'data_matchmaker_quiz',
          event_label: eventName,
          ...parameters
        });
        // console.log('GA Event tracked:', eventName, parameters);
      } else {
        // console.log('GA not available, would track:', eventName, parameters);
      }
    } catch (error) {
      console.error('Error tracking GA event:', error);
    }
  };

  // HubSpot form integration
  useEffect(() => {
    // Load HubSpot script if not already loaded
    if (!window.hbspt) {
      const script = document.createElement('script');
      script.src = '//js.hsforms.net/forms/embed/v2.js';
      script.async = true;
      script.onload = () => {
        // console.log('HubSpot script loaded');
      };
      document.body.appendChild(script);
    }
  }, []);

  const createHubSpotForm = () => {
    if (window.hbspt) {
      window.hbspt.forms.create({
        region: "na1", // Replace with your HubSpot region
        portalId: '6880682', // Replace with your HubSpot Portal ID
        formId: "d8916772-d73e-4ca2-84f9-3abd8082be1d", // Replace with your HubSpot Form ID
        target: '#hubspot-form-container',
        
        onFormReady: () => {
          // console.log('HubSpot form ready');
          // Apply styling multiple times to ensure it sticks
          setTimeout(() => applyCustomFormStyling(), 50);
          setTimeout(() => applyCustomFormStyling(), 200);
          setTimeout(() => applyCustomFormStyling(), 500);
          setTimeout(() => applyCustomFormStyling(), 1000);
        },
        onFormSubmit: () => {
          // console.log('HubSpot form submitted');
        },
        onFormSubmitted: () => {
          // console.log('HubSpot form submission completed');
          
          // Track successful form submission
          trackEvent('regovern_signup_complete', {
            quiz_result: quiz.selectedMatch || 'unknown',
            form_source: 'hubspot_modal'
          });
          
          // Close modal after successful submission
          setTimeout(() => {
            setQuiz(prev => ({ ...prev, showHubSpotModal: false }));
          }, 2000);
        }
      });
    }
  };

  const applyCustomFormStyling = () => {
    const container = document.getElementById('hubspot-form-container');
    if (!container) return;

    try {
      // Remove any existing style tags to prevent conflicts
      const existingStyles = container.querySelectorAll('style[data-custom-form-styles]');
      existingStyles.forEach(style => style.remove());

      // Create comprehensive CSS styles
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-custom-form-styles', 'true');
      styleTag.textContent = `
        #hubspot-form-container * {
          box-sizing: border-box !important;
        }
        
        #hubspot-form-container .hs-form {
          font-family: inherit !important;
        }
        
        #hubspot-form-container .hs-form-field {
          margin-bottom: 1rem !important;
        }
        
        #hubspot-form-container input[type="text"],
        #hubspot-form-container input[type="email"],
        #hubspot-form-container input[type="tel"],
        #hubspot-form-container textarea,
        #hubspot-form-container select {
          display: flex !important;
          height: 2.5rem !important;
          width: 100% !important;
          border-radius: 0.375rem !important;
          border: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--background)) !important;
          padding: 0.5rem 0.75rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          color: hsl(var(--foreground)) !important;
          outline: none !important;
          transition: all 0.2s !important;
          margin: 0 !important;
        }
        
        #hubspot-form-container input:focus,
        #hubspot-form-container textarea:focus,
        #hubspot-form-container select:focus {
          outline: 2px solid hsl(var(--ring)) !important;
          outline-offset: 2px !important;
          border-color: hsl(var(--ring)) !important;
        }
        
        #hubspot-form-container input::placeholder,
        #hubspot-form-container textarea::placeholder {
          color: hsl(var(--muted-foreground)) !important;
        }
        
        #hubspot-form-container label {
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          line-height: 1 !important;
          margin-bottom: 0.5rem !important;
          display: block !important;
          color: hsl(var(--foreground)) !important;
        }
        
        #hubspot-form-container .hs-error-msg,
        #hubspot-form-container .hs-main-font-element {
          font-size: 0.75rem !important;
          color: #ef4444 !important;
          margin-top: 0.25rem !important;
          display: block !important;
        }
        
        #hubspot-form-container input[type="submit"],
        #hubspot-form-container button[type="submit"],
        #hubspot-form-container .hs-button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 0.375rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          line-height: 1.25rem !important;
          transition: all 0.2s !important;
          background-color: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          border: none !important;
          height: 2.5rem !important;
          padding: 0.5rem 1rem !important;
          width: 100% !important;
          cursor: pointer !important;
          margin-top: 1rem !important;
        }
        
        #hubspot-form-container input[type="submit"]:hover,
        #hubspot-form-container button[type="submit"]:hover,
        #hubspot-form-container .hs-button:hover {
          background-color: hsl(var(--primary)) !important;
          opacity: 0.9 !important;
        }
        
        #hubspot-form-container .hs-form-required {
          color: #ef4444 !important;
          font-size: 0.75rem !important;
          margin-left: 0.25rem !important;
        }
        
        #hubspot-form-container .hs-richtext,
        #hubspot-form-container .hs-form-booleancheckbox-display:has(*:contains("HubSpot")) {
          display: none !important;
        }
        
        #hubspot-form-container .hs-form-booleancheckbox-display {
          margin-top: 0.5rem !important;
        }
        
        #hubspot-form-container .hs-form-booleancheckbox input[type="checkbox"] {
          height: 1rem !important;
          width: 1rem !important;
          margin-right: 0.5rem !important;
        }
      `;
      
      container.appendChild(styleTag);

      // Force submit button text update
      setTimeout(() => {
        const submitBtn = container.querySelector('input[type="submit"], button[type="submit"], .hs-button');
        if (submitBtn && submitBtn.textContent !== 'Register for Re:Govern') {
          (submitBtn as HTMLElement).textContent = 'Register for Re:Govern';
        }
      }, 100);

      // console.log('Enhanced form styling applied successfully');
    } catch (error) {
      console.error('Error applying form styling:', error);
    }
  };

  const openHubSpotModal = () => {
    // Track Re:Govern signup click
    trackEvent('regovern_signup_click', {
      quiz_result: quiz.selectedMatch || 'unknown',
      source: 'quiz_results'
    });
    
    setQuiz(prev => ({ ...prev, showHubSpotModal: true }));
    // Create form after modal opens
    setTimeout(() => {
      createHubSpotForm();
    }, 100);
  };

  const closeHubSpotModal = () => {
    setQuiz(prev => ({ ...prev, showHubSpotModal: false }));
    // Clear the form container
    const container = document.getElementById('hubspot-form-container');
    if (container) {
      container.innerHTML = '';
    }
  };

  // Robust styling persistence using MutationObserver
  useEffect(() => {
    if (quiz.showHubSpotModal) {
      let observer: MutationObserver | null = null;
      
      const setupObserver = () => {
        const container = document.getElementById('hubspot-form-container');
        if (!container) return;

        // Apply initial styling
        applyCustomFormStyling();

        // Set up observer to watch for DOM changes
        observer = new MutationObserver((mutations) => {
          let shouldRestyle = false;
          
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
              shouldRestyle = true;
            }
          });

          if (shouldRestyle) {
            setTimeout(() => applyCustomFormStyling(), 100);
          }
        });

        observer.observe(container, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style']
        });
      };

      // Setup observer after modal opens
      const timeoutId = setTimeout(setupObserver, 200);

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [quiz.showHubSpotModal]);

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
            <Button 
              size="lg" 
              onClick={() => {
                trackEvent('result_cta_click', {
                  result_id: result.id,
                  result_title: result.title,
                  cta_text: result.ctaText,
                  destination_url: result.ctaUrl
                });
                window.open(result.ctaUrl, '_blank');
              }}
            >
              {result.ctaText}
            </Button>
          </div>
        </Card>

        <div className="flex justify-center space-x-4">
          <a 
            href="#" 
            onClick={shareOnLinkedIn}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--linkedin))] text-white hover:bg-[hsl(var(--linkedin))]/90 rounded-lg font-medium transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
          </a>
          <a 
            href="#" 
            onClick={shareOnTwitter}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--twitter))] text-white hover:bg-[hsl(var(--twitter))]/90 rounded-lg font-medium transition-colors"
          >
            <img src={XIcon} alt="X icon" className="w-4 h-4" />
            Share on X
          </a>
        </div>

        <div className="text-center">
          <Button 
              variant="linkedin" 
              size="lg" 
              onClick={openHubSpotModal}
              className="bg-primary"
            >
              Sign up for Re:Govern
          </Button>
        </div>

        <div className="text-center">
          <Button variant="ghost" onClick={resetQuiz}>
            <RotateCcw className="w-6 h-6 mr-1" />
            Take Quiz Again
          </Button>
        </div>

        {/* HubSpot Form Modal */}
        <Dialog 
          open={quiz.showHubSpotModal} 
          onOpenChange={(open) => {
            if (!open) {
              closeHubSpotModal();
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Sign up for Re:Govern
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Join us at Re:Govern, the premier data governance conference. Register below 
                to secure your spot and connect with data leaders from around the world.
              </p>
              <div id="hubspot-form-container" className="min-h-[200px]">
                {/* HubSpot form will be injected here */}
                <div className="flex items-center justify-center h-32">
                  <div className="text-sm text-muted-foreground">Loading form...</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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