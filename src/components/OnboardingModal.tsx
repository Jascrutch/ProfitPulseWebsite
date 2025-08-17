import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  image?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ProfitPulse!',
    content: 'Get ready to experience the most advanced trading platform. Let us show you around!',
    image: '🚀',
  },
  {
    id: 'dashboard',
    title: 'Your Trading Dashboard',
    content: 'Here you can see your portfolio overview, recent performance, and quick stats. Everything you need at a glance.',
    target: '.dashboard',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Positions',
    content: 'Monitor all your current holdings, see real-time prices, and track your gains and losses.',
    target: '.positions-section',
  },
  {
    id: 'navigation',
    title: 'Navigation Menu',
    content: 'Access all features through the sidebar. Trading, watchlist, order history, and more!',
    target: '.sidebar',
    position: 'right',
  },
  {
    id: 'notifications',
    title: 'Stay Informed',
    content: 'Keep track of important alerts, price changes, and trade confirmations in your notification center.',
    target: '[aria-label*="Notifications"]',
    position: 'bottom',
  },
  {
    id: 'search',
    title: 'Search & Discover',
    content: 'Quickly find stocks, ETFs, and other securities using our powerful search feature.',
    target: '.search-container',
    position: 'bottom',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    content: 'Start exploring ProfitPulse and make your first trade. Remember, you can always access help from the sidebar.',
    image: '🎉',
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const step = onboardingSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        // Highlight the target element
        element.style.position = 'relative';
        element.style.zIndex = '1001';
        element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
        element.style.borderRadius = '8px';
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      }
    }

    return () => {
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
      }
    };
  }, [currentStep, isOpen, targetElement]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleFinish = () => {
    onClose();
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="onboarding-overlay"
        onClick={handleSkip}
        role="button"
        tabIndex={0}
        aria-label="Close onboarding"
      />

      {/* Modal */}
      <div 
        className="onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-content"
      >
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {currentStep + 1} of {onboardingSteps.length}
            </span>
          </div>
          <button
            className="onboarding-close"
            onClick={handleSkip}
            aria-label="Close onboarding"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="onboarding-body">
          {currentStepData.image && (
            <div className="onboarding-image">
              <span className="emoji-icon">{currentStepData.image}</span>
            </div>
          )}
          
          <h2 id="onboarding-title" className="onboarding-title">
            {currentStepData.title}
          </h2>
          
          <p id="onboarding-content" className="onboarding-content">
            {currentStepData.content}
          </p>
        </div>

        <div className="onboarding-footer">
          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button
                className="onboarding-button secondary"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            
            <button
              className="onboarding-button tertiary"
              onClick={handleSkip}
            >
              Skip Tour
            </button>
            
            {isLastStep ? (
              <button
                className="onboarding-button primary"
                onClick={handleFinish}
              >
                Get Started
              </button>
            ) : (
              <button
                className="onboarding-button primary"
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="onboarding-dots">
          {onboardingSteps.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <style jsx>{`
          .onboarding-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(2px);
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
          }

          .onboarding-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
            animation: slideUp 0.3s ease-out;
          }

          .onboarding-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem 1rem 2rem;
            border-bottom: 1px solid #f0f0f0;
          }

          .onboarding-progress {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex: 1;
          }

          .progress-bar {
            flex: 1;
            height: 4px;
            background: #f0f0f0;
            border-radius: 2px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #007bff, #0056b3);
            border-radius: 2px;
            transition: width 0.3s ease;
          }

          .progress-text {
            font-size: 14px;
            color: #666;
            white-space: nowrap;
          }

          .onboarding-close {
            background: none;
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            color: #666;
            transition: all 0.2s;
          }

          .onboarding-close:hover {
            background: #f5f5f5;
            color: #333;
          }

          .onboarding-body {
            padding: 2rem;
            text-align: center;
          }

          .onboarding-image {
            margin-bottom: 1.5rem;
          }

          .emoji-icon {
            font-size: 4rem;
            line-height: 1;
          }

          .onboarding-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #333;
            margin: 0 0 1rem 0;
          }

          .onboarding-content {
            font-size: 1rem;
            color: #666;
            line-height: 1.6;
            margin: 0;
          }

          .onboarding-footer {
            padding: 1rem 2rem 1.5rem 2rem;
            border-top: 1px solid #f0f0f0;
          }

          .onboarding-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            align-items: center;
          }

          .onboarding-button {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }

          .onboarding-button.primary {
            background: #007bff;
            color: white;
          }

          .onboarding-button.primary:hover {
            background: #0056b3;
          }

          .onboarding-button.secondary {
            background: #f8f9fa;
            color: #333;
            border: 1px solid #dee2e6;
          }

          .onboarding-button.secondary:hover {
            background: #e9ecef;
          }

          .onboarding-button.tertiary {
            background: none;
            color: #666;
          }

          .onboarding-button.tertiary:hover {
            color: #333;
            background: #f8f9fa;
          }

          .onboarding-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            padding: 0 2rem 1.5rem 2rem;
          }

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #dee2e6;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
          }

          .dot.active {
            background: #007bff;
            transform: scale(1.2);
          }

          .dot:hover:not(.active) {
            background: #adb5bd;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) translateY(20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) translateY(0);
            }
          }

          @media (max-width: 768px) {
            .onboarding-modal {
              width: 95%;
              margin: 1rem;
            }

            .onboarding-header,
            .onboarding-body,
            .onboarding-footer,
            .onboarding-dots {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }

            .onboarding-actions {
              flex-direction: column;
              gap: 0.5rem;
            }

            .onboarding-button {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </>
  );
};

// Hook to manage onboarding state
export const useOnboarding = () => {
  const { user, isAuthenticated } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    'onboarding_completed',
    false
  );
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding && user) {
      // Show onboarding after a short delay to ensure page is loaded
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, hasCompletedOnboarding, user]);

  const startOnboarding = () => {
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  return {
    showOnboarding,
    hasCompletedOnboarding,
    startOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};

// Component to integrate with the app
const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showOnboarding, completeOnboarding } = useOnboarding();

  return (
    <>
      {children}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={completeOnboarding}
      />
    </>
  );
};

export default OnboardingProvider;