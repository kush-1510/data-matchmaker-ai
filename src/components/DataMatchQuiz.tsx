import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Share2, Linkedin, Twitter } from 'lucide-react';

interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  showSwipeCards: boolean;
  currentCard: number;
  showResult: boolean;
  showLeadForm: boolean;
  selectedMatch: string | null;
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
      { text: "Missing metadata that should be obvious", subtitle: "Context is king 👑" },
      { text: "Dashboards that all say something different", subtitle: "" },
      { text: "Pipelines breaking right before an exec meeting", subtitle: "" },
      { text: "New AI models popping up with no governance", subtitle: "" }
    ]
  },
  {
    text: "What do you want most in a partner?",
    options: [
      { text: "Someone who always brings context to the table", subtitle: "👑" },
      { text: "Active, not passive, about metadata", subtitle: "" },
      { text: "Ready for the future (and AI)", subtitle: "" },
      { text: "All of the above", subtitle: "(why settle?)" }
    ]
  },
  {
    text: "What's your biggest red flag?",
    options: [
      { text: "Ghosts you during audits", subtitle: "" },
      { text: "Shows up late with broken pipelines", subtitle: "" },
      { text: "Never shares context, just vibes", subtitle: "" },
      { text: "Promises they're \"AI-ready\" but can't even pass a lineage check", subtitle: "" }
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
    ctaUrl: '#'
  },
  {
    id: 'shadow-ai',
    emoji: '👻',
    title: 'Shadow AI Model',
    age: 'Unknown',
    description: "I move fast and break compliance. Big fan of secrets, hate documentation.\nI'll ghost you during audits but look amazing in demos.",
    ctaText: 'See how Atlan brings models into the light',
    ctaUrl: '#'
  },
  {
    id: 'data-quality',
    emoji: '✅',
    title: 'Data Quality',
    age: 'Mature, dependable',
    description: 'Low drama, high standards. Gets overlooked, but always there when you need me. Ready for a long-term relationship, if you\'ll just notice me.',
    ctaText: 'See how Atlan makes quality everyone\'s job',
    ctaUrl: '#'
  },
  {
    id: 'atlan',
    emoji: '💙',
    title: 'Atlan',
    age: 'Timeless',
    description: 'Transparent, reliable, AI-ready. Context is my love language. I\'ll never ghost you, and your board will love me. Let\'s build something real.',
    ctaText: 'Book a demo',
    ctaUrl: '#',
    secondaryCta: 'See it live at Re:Govern',
    secondaryUrl: 'https://atlan.com/regovern/'
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
    selectedMatch: null
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
    
    if (quiz.currentQuestion < questions.length - 1) {
      setQuiz({
        ...quiz,
        answers: newAnswers,
        currentQuestion: quiz.currentQuestion + 1
      });
    } else {
      setQuiz({
        ...quiz,
        answers: newAnswers,
        showSwipeCards: true
      });
    }
  };

  const handleCardChoice = (choice: 'skip' | 'choose') => {
    if (choice === 'choose') {
      setQuiz({
        ...quiz,
        selectedMatch: results[quiz.currentCard].id,
        showResult: true
      });
    } else {
      // Skip to next card
      if (quiz.currentCard < results.length - 1) {
        setQuiz({
          ...quiz,
          currentCard: quiz.currentCard + 1
        });
      } else {
        // If they've skipped all cards, show Atlan as default
        setQuiz({
          ...quiz,
          selectedMatch: 'atlan',
          showResult: true
        });
      }
    }
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
      selectedMatch: null
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
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="p-8 text-center shadow-card-hover border-2">
          <div className="text-6xl mb-4">{result.emoji}</div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
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
            
            {result.secondaryCta && (
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.open(result.secondaryUrl, '_blank')}
              >
                {result.secondaryCta}
              </Button>
            )}
          </div>
        </Card>

        <div className="flex justify-center space-x-4">
          <Button variant="share" onClick={shareOnLinkedIn}>
            <Linkedin className="w-4 h-4" />
            Share
          </Button>
          <Button variant="share" onClick={shareOnTwitter}>
            <Twitter className="w-4 h-4" />
            Tweet
          </Button>
        </div>

        {!quiz.showLeadForm && (
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setQuiz({ ...quiz, showLeadForm: true })}
            >
              Want updates? Leave your info
            </Button>
          </div>
        )}

        {quiz.showLeadForm && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Stay in touch</h3>
            <form onSubmit={submitLeadForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={leadForm.role}
                    onChange={(e) => setLeadForm({ ...leadForm, role: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <Button type="submit">Submit</Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setQuiz({ ...quiz, showLeadForm: false })}
                >
                  Skip
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="text-center">
          <Button variant="ghost" onClick={resetQuiz}>
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
          <h2 className="text-3xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Your potential matches
          </h2>
          <p className="text-muted-foreground">
            Card {quiz.currentCard + 1} of {results.length}
          </p>
        </div>

        <Card className="p-8 text-center shadow-card-hover border-2 bg-gradient-to-br from-background to-muted/20">
          <div className="text-6xl mb-4">{currentCard.emoji}</div>
          <h3 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
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
            >
              ❌ Skip
            </Button>
            <Button 
              size="lg"
              onClick={() => handleCardChoice('choose')}
              className="px-8 bg-gradient-primary"
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

      <Card className="p-8 shadow-card-hover">
        <h2 className="text-2xl font-bold mb-8 text-center">{currentQ.text}</h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <Button
              key={index}
              variant="quiz"
              className="w-full p-6 h-auto text-left justify-start"
              onClick={() => handleAnswer(index)}
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