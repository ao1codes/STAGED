import { useState, useEffect } from "react";

interface StoryProgress {
  filesRead: Set<string>;
  unlockedContent: Set<string>;
  currentPhase: 'discovery' | 'suspicion' | 'realization' | 'confrontation';
  daysElapsed: number;
}

export function useStoryProgress() {
  const [storyProgress, setStoryProgress] = useState<StoryProgress>(() => {
    const saved = localStorage.getItem('staged-story-progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        filesRead: new Set(parsed.filesRead || []),
        unlockedContent: new Set(parsed.unlockedContent || [])
      };
    }
    return {
      filesRead: new Set<string>(),
      unlockedContent: new Set<string>(),
      currentPhase: 'discovery' as const,
      daysElapsed: 47
    };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const toSave = {
      ...storyProgress,
      filesRead: Array.from(storyProgress.filesRead),
      unlockedContent: Array.from(storyProgress.unlockedContent)
    };
    localStorage.setItem('staged-story-progress', JSON.stringify(toSave));
  }, [storyProgress]);

  const markFileAsRead = (fileName: string) => {
    setStoryProgress(prev => {
      const newFilesRead = new Set(prev.filesRead);
      newFilesRead.add(fileName);
      
      // Determine story phase based on files read
      let newPhase = prev.currentPhase;
      if (newFilesRead.has('icarus.ts') && newFilesRead.has('morgan_notes.tsx')) {
        newPhase = 'suspicion';
      }
      if (newFilesRead.has('team_chat.log') && newFilesRead.has('git_logs.txt')) {
        newPhase = 'realization';
      }
      if (newFilesRead.size >= 5) {
        newPhase = 'confrontation';
      }
      
      return {
        ...prev,
        filesRead: newFilesRead,
        currentPhase: newPhase
      };
    });
  };

  const unlockContent = (contentId: string) => {
    setStoryProgress(prev => ({
      ...prev,
      unlockedContent: new Set(Array.from(prev.unlockedContent).concat(contentId))
    }));
  };

  const resetProgress = () => {
    setStoryProgress({
      filesRead: new Set<string>(),
      unlockedContent: new Set<string>(),
      currentPhase: 'discovery',
      daysElapsed: 47
    });
    localStorage.removeItem('staged-story-progress');
  };

  return {
    storyProgress,
    markFileAsRead,
    unlockContent,
    resetProgress
  };
}
