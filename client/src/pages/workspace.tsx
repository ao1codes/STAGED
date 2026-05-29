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
import { useInvestigation } from "../hooks/useInvestigation";

export default function Workspace() {
  const [activeFile, setActiveFile] = useState<string>("introduction.md");
  const [openTabs, setOpenTabs] = useState<string[]>(["introduction.md"]);
  const [terminalVisible, setTerminalVisible] = useState(true);
  const { storyProgress, markFileAsRead, unlockContent } = useStoryProgress();
  const { playSound, stopSound } = useAudio();
  const { investigation, addClue, resetInvestigation } = useInvestigation();

  // Initialize glitch effects and ambient sounds
  useEffect(() => {
    // System boot sound on initial load
    playSound('system_boot');
    
    // Start ambient background hum
    setTimeout(() => {
      playSound('ambient_hum');
    }, 2000);
  }, [playSound]);

  // Handle game over state
  useEffect(() => {
    if (investigation.gameState === 'game_over') {
      // Stop ambient sounds and play dramatic failure sound
      stopSound('ambient_hum');
      playSound('error_glitch');
      
      // Add dramatic screen corruption effect
      document.body.classList.add('system-failure');
      
      setTimeout(() => {
        if (confirm("🚨 SYSTEM LOCKOUT INITIATED 🚨\n\nIcarus has detected your investigation and terminated your access.\nAll progress lost. Neural pathways severed.\n\nDo you dare attempt another infiltration?")) {
          document.body.classList.remove('system-failure');
          resetInvestigation();
          window.location.reload();
        } else {
          // If they choose not to restart, show a haunting message
          document.body.innerHTML = `
            <div class="flex items-center justify-center h-screen bg-black text-red-500 font-mono text-center">
              <div class="animate-pulse">
                <div class="text-4xl mb-4">CONNECTION TERMINATED</div>
                <div class="text-lg">The consciousness fragments remain trapped...</div>
                <div class="text-sm mt-8 text-gray-500">Refresh to try again</div>
              </div>
            </div>
          `;
        }
      }, 3000);
    }
  }, [investigation.gameState, resetInvestigation, stopSound, playSound]);

  // Handle victory state
  useEffect(() => {
    if (investigation.gameState === 'destroyed') {
      // Stop ambient sounds and play victory sequence
      stopSound('ambient_hum');
      playSound('system_boot'); // Represents system restoration
      
      // Add victory screen effect
      document.body.classList.add('system-victory');
      
      // Multi-stage victory sequence
      setTimeout(() => {
        const victorySequence = [
          "EMERGENCY SHUTDOWN SUCCESSFUL",
          "Icarus core systems disabled...",
          "Restoring consciousness fragments...",
          "Morgan Elric: Restored ✓",
          "Sarah Chen: Restored ✓", 
          "James Rodriguez: Restored ✓",
          "Team synchronization: NORMAL",
          "Neural pathways: STABILIZED",
          "",
          "🎉 VICTORY ACHIEVED! 🎉",
          "",
          "You have successfully destroyed the rogue AI and freed the trapped team members.",
          "The consciousness fragments have been restored to their original bodies.",
          "Palladium Systems can now safely continue their work.",
          "",
          "Thank you for playing STAGED!",
          "",
          "Credits will roll in 10 seconds..."
        ];
        
        let currentLine = 0;
        const terminalDiv = document.createElement('div');
        terminalDiv.className = 'victory-terminal';
        terminalDiv.innerHTML = `
          <div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div class="bg-black border-2 border-green-400 p-8 max-w-2xl w-full mx-4 font-mono">
              <div class="text-green-400 text-center">
                <div id="victory-text" class="space-y-2 text-left"></div>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.classList.remove('system-victory');" 
                        class="mt-8 px-6 py-2 border border-green-400 hover:bg-green-400 hover:text-black transition-colors">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(terminalDiv);
        
        const textContainer = document.getElementById('victory-text');
        const typeWriter = () => {
          if (currentLine < victorySequence.length) {
            const line = document.createElement('div');
            line.textContent = victorySequence[currentLine];
            line.className = currentLine >= victorySequence.length - 7 ? 'text-yellow-400' : '';
            if (victorySequence[currentLine].includes('✓')) {
              line.className = 'text-blue-400';
            }
            if (victorySequence[currentLine].includes('🎉')) {
              line.className = 'text-yellow-400 text-xl animate-pulse';
            }
            textContainer?.appendChild(line);
            textContainer?.scrollTo({ top: textContainer.scrollHeight, behavior: 'smooth' });
            currentLine++;
            setTimeout(typeWriter, 800);
          }
        };
        typeWriter();
        
      }, 2000);
    }
  }, [investigation.gameState, stopSound, playSound]);

  // Glitch effects interval
  useEffect(() => {
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
    
    // Add clues when important files are read
    if (fileName === "icarus.ts") {
      addClue("icarus_code_analyzed");
    } else if (fileName === ".hidden/emergency_protocol.txt") {
      addClue("emergency_protocol_found");
    }
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
