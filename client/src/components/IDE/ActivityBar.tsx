import { Search, GitBranch, Play, Puzzle, Settings } from "lucide-react";

interface ActivityBarProps {
  onToggleTerminal: () => void;
}

export default function ActivityBar({ onToggleTerminal }: ActivityBarProps) {
  return (
    <div className="w-12 editor-sidebar border-l editor-border flex flex-col items-center py-3 space-y-4 h-full">
      <div title="Search">
        <Search className="editor-muted hover:editor-accent cursor-pointer" size={18} />
      </div>
      <div title="Source Control">
        <GitBranch className="editor-muted hover:editor-accent cursor-pointer" size={18} />
      </div>
      <div title="Run & Debug">
        <Play className="editor-muted hover:editor-accent cursor-pointer" size={18} />
      </div>
      <div title="Extensions">
        <Puzzle className="editor-warning hover:editor-accent cursor-pointer animate-pulse" size={18} />
      </div>
      <div className="flex-1"></div>
      <div title="Settings" onClick={onToggleTerminal}>
        <Settings className="editor-muted hover:editor-accent cursor-pointer" size={18} />
      </div>
    </div>
  );
}
