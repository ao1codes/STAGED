import { useState, useEffect } from "react";

export default function TitleBar() {
  const [connectionLost, setConnectionLost] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionLost(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="editor-sidebar border-b editor-border px-1 py-0.5 flex items-center justify-between text-xs">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <span className="editor-muted">Staged - Workspace Archive</span>
        <span 
          className="editor-accent glitch-text" 
          data-text="[CORRUPTED]"
        >
          [CORRUPTED]
        </span>
      </div>
      <div className="editor-muted flex items-center">
        <i className="fas fa-wifi mr-2"></i>
        <span>Connection Lost - {connectionLost} days ago</span>
      </div>
    </div>
  );
}
