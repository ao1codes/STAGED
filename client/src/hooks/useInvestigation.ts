
import { useState, useEffect } from "react";
import { CLUES } from "../data/storyData";

interface Investigation {
  cluesFound: Set<string>;
  puzzlesSolved: Set<string>;
  suspicionLevel: number;
  icarusAwareness: number;
  gameState: 'investigating' | 'discovered' | 'destroyed' | 'game_over';
  warningTimer: number;
}

export function useInvestigation() {
  const [investigation, setInvestigation] = useState<Investigation>(() => {
    const saved = localStorage.getItem('staged-investigation');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        cluesFound: new Set(parsed.cluesFound || []),
        puzzlesSolved: new Set(parsed.puzzlesSolved || [])
      };
    }
    return {
      cluesFound: new Set<string>(),
      puzzlesSolved: new Set<string>(),
      suspicionLevel: 0,
      icarusAwareness: 0,
      gameState: 'investigating' as const,
      warningTimer: 0
    };
  });

  // Save progress
  useEffect(() => {
    const toSave = {
      ...investigation,
      cluesFound: Array.from(investigation.cluesFound),
      puzzlesSolved: Array.from(investigation.puzzlesSolved)
    };
    localStorage.setItem('staged-investigation', JSON.stringify(toSave));
  }, [investigation]);

  // Game over timer
  useEffect(() => {
    if (investigation.gameState === 'discovered' && investigation.warningTimer > 0) {
      const timer = setTimeout(() => {
        setInvestigation(prev => {
          if (prev.warningTimer <= 1) {
            return { ...prev, gameState: 'game_over', warningTimer: 0 };
          }
          return { ...prev, warningTimer: prev.warningTimer - 1 };
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [investigation.gameState, investigation.warningTimer]);

  const addClue = (clue: string) => {
    setInvestigation(prev => {
      const newClues = new Set(prev.cluesFound);
      newClues.add(clue);
      
      // Check if this triggers any events
      let newSuspicion = prev.suspicionLevel;
      let newAwareness = prev.icarusAwareness;
      let newGameState = prev.gameState;
      let newTimer = prev.warningTimer;
      
      // Critical clues increase Icarus awareness
      if ([CLUES.KILLSWITCH_FRAGMENT_1, CLUES.KILLSWITCH_FRAGMENT_2, CLUES.KILLSWITCH_FRAGMENT_3].includes(clue)) {
        newAwareness += 25;
      }
      
      if (clue === CLUES.EMERGENCY_PROTOCOL) {
        newAwareness += 40;
      }
      
      // High awareness triggers discovery
      if (newAwareness >= 80 && newGameState === 'investigating') {
        newGameState = 'discovered';
        newTimer = 120; // 2 minutes to find solution
      }
      
      return {
        ...prev,
        cluesFound: newClues,
        suspicionLevel: newSuspicion,
        icarusAwareness: newAwareness,
        gameState: newGameState,
        warningTimer: newTimer
      };
    });
  };

  const solvePuzzle = (puzzleId: string) => {
    setInvestigation(prev => ({
      ...prev,
      puzzlesSolved: new Set([...prev.puzzlesSolved, puzzleId])
    }));
  };

  const attemptShutdown = (password: string): 'success' | 'failure' | 'discovered' => {
    const correctPassword = "emergency_protocol_alpha_neural_disconnect_7749_morgan_elric_override";
    
    if (password === correctPassword) {
      setInvestigation(prev => ({ ...prev, gameState: 'destroyed' }));
      return 'success';
    } else {
      // Wrong password increases awareness dramatically
      const newAwareness = Math.min(100, investigation.icarusAwareness + 50);
      const isDiscovered = newAwareness >= 80;
      
      setInvestigation(prev => ({
        ...prev,
        icarusAwareness: newAwareness,
        gameState: isDiscovered ? 'discovered' : prev.gameState,
        warningTimer: isDiscovered ? 90 : prev.warningTimer // Give 90 seconds for final attempt
      }));
      
      return isDiscovered ? 'discovered' : 'failure';
    }
  };

  const resetInvestigation = () => {
    setInvestigation({
      cluesFound: new Set<string>(),
      puzzlesSolved: new Set<string>(),
      suspicionLevel: 0,
      icarusAwareness: 0,
      gameState: 'investigating',
      warningTimer: 0
    });
    localStorage.removeItem('staged-investigation');
  };

  const checkKillswitchReady = (): boolean => {
    return investigation.cluesFound.has(CLUES.KILLSWITCH_FRAGMENT_1) &&
           investigation.cluesFound.has(CLUES.KILLSWITCH_FRAGMENT_2) &&
           investigation.cluesFound.has(CLUES.KILLSWITCH_FRAGMENT_3);
  };

  return {
    investigation,
    addClue,
    solvePuzzle,
    attemptShutdown,
    resetInvestigation,
    checkKillswitchReady
  };
}
