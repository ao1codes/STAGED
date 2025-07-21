import { useState, useEffect } from "react";
import TitleBar from "../components/IDE/TitleBar";
import FileExplorer from "../components/IDE/FileExplorer";
import TabBar from "../components/IDE/TabBar";
import CodeEditor from "../components/IDE/CodeEditor";
import Terminal from "../components/IDE/Terminal";
import ActivityBar from "../components/IDE/ActivityBar";
import StatusBar from "../components/IDE/StatusBar";
import { useStoryProgress } from "../hooks/useStoryProgress";
import { useAudio } from "../hooks/useAudio";

export default function Workspace() {
  const [activeFile, setActiveFile] = useState<string>("introduction.md");
  const [openTabs, setOpenTabs] = useState<string[]>(["introduction.md"]);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const { storyProgress, markFileAsRead, unlockContent } = useStoryProgress();
  const { playSound, stopSound } = useAudio();

  // Initialize glitch effects and ambient sounds
  useEffect(() => {
    // System boot sound on initial load
    playSound('system_boot');
    
    // Start ambient background hum
    setTimeout(() => {
      playSound('ambient_hum');
    }, 2000);

    const glitchInterval = setInterval(() => {
      const glitchElements = document.querySelectorAll('.glitch-text');
      glitchElements.forEach(el => {
        if (Math.random() < 0.1) {
          (el as HTMLElement).style.transform = `translateX(${Math.random() * 2 - 1}px)`;
          setTimeout(() => {
            (el as HTMLElement).style.transform = 'translateX(0)';
          }, 100);
        }
      });
      
      // Random glitch sounds for corrupted files
      if (Math.random() < 0.05) {
        playSound('data_corruption');
      }
    }, 1000);

    return () => {
      clearInterval(glitchInterval);
      stopSound('ambient_hum');
    };
  }, [playSound, stopSound]);

  const handleFileOpen = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveFile(fileName);
    markFileAsRead(fileName);
  };

  const handleTabClose = (fileName: string) => {
    const newTabs = openTabs.filter(tab => tab !== fileName);
    setOpenTabs(newTabs);
    
    if (activeFile === fileName) {
      if (newTabs.length > 0) {
        setActiveFile(newTabs[newTabs.length - 1]);
      } else {
        setActiveFile("");
      }
    }
  };

  const handleTabSelect = (fileName: string) => {
    setActiveFile(fileName);
  };

  return (
    <div className="h-screen w-screen flex flex-col animate-flicker editor-bg editor-text crt-effect scanlines overflow-hidden">
      <div className="flex-none">
        <TitleBar />
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-none">
          <FileExplorer 
            onFileSelect={handleFileOpen}
            storyProgress={storyProgress}
          />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-none">
            <TabBar 
              openTabs={openTabs}
              activeTab={activeFile}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
            />
          </div>
          
          <div className="flex-1 overflow-hidden">
            {activeFile && (
              <CodeEditor 
                fileName={activeFile}
                storyProgress={storyProgress}
                onUnlockContent={unlockContent}
              />
            )}
            {!activeFile && (
              <div className="h-full flex items-center justify-center editor-bg editor-muted">
                <div className="text-center">
                  <div className="text-lg mb-2">No file selected</div>
                  <div className="text-sm">Open a file from the explorer to view its contents</div>
                </div>
              </div>
            )}
          </div>
          
          {terminalVisible && (
            <div className="flex-none">
              <Terminal 
                storyProgress={storyProgress}
                onUnlockContent={unlockContent}
              />
            </div>
          )}
        </div>
        
        <div className="flex-none">
          <ActivityBar onToggleTerminal={() => setTerminalVisible(!terminalVisible)} />
        </div>
      </div>
      
      <div className="flex-none">
        <StatusBar 
          activeFile={activeFile}
          storyProgress={storyProgress}
        />
      </div>
    </div>
  );
}
