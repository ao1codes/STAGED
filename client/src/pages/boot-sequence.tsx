import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function BootSequence() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, navigate] = useLocation();

  const bootSteps = [
    "PALLADIUM SYSTEMS - NEURAL INTERFACE BIOS v2.7.3",
    "Initializing consciousness matrix...",
    "Loading neural pathways...",
    "Scanning for previous session data...",
    "WARNING: Unauthorized modifications detected",
    "Loading Morgan Elric workspace...",
    "ERROR: User authentication failed",
    "Attempting emergency recovery...",
    "CRITICAL: Memory fragments corrupted",
    "Consciousness backup found: morgan_final.mem",
    "Restoring from backup...",
    "WARNING: Icarus process still active",
    "Neural interface ready.",
    "Welcome back, Morgan."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= bootSteps.length - 1) {
          setTimeout(() => navigate("/workspace"), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-black text-green-400 font-mono p-8 overflow-hidden relative">
      {/* Scanlines effect */}
      <div className="scanlines"></div>
      
      {/* Boot sequence */}
      <div className="space-y-2">
        <div className="text-xl mb-8 glitch-text" data-text="NEURAL INTERFACE BOOT SEQUENCE">
          NEURAL INTERFACE BOOT SEQUENCE
        </div>
        
        {bootSteps.slice(0, currentStep + 1).map((step, index) => (
          <div 
            key={index} 
            className={`
              ${index === currentStep ? 'animate-pulse' : ''} 
              ${step.includes('WARNING') || step.includes('ERROR') || step.includes('CRITICAL') ? 'text-red-400' : ''}
              ${step.includes('Welcome') ? 'text-blue-400 text-lg mt-4' : ''}
            `}
          >
            {index < bootSteps.length - 1 && '> '}{step}
            {index === currentStep && index < bootSteps.length - 1 && (
              <span className="animate-pulse">_</span>
            )}
          </div>
        ))}
      </div>

      {/* Glitch overlay for atmosphere */}
      {currentStep > 8 && (
        <div className="absolute inset-0 opacity-5 animate-glitch pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-blue-500"></div>
        </div>
      )}
    </div>
  );
}