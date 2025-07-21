import { GitBranch, AlertTriangle } from "lucide-react";

interface StatusBarProps {
  activeFile: string;
  storyProgress: any;
}

export default function StatusBar({ activeFile, storyProgress }: StatusBarProps) {
  const getLineInfo = () => {
    if (activeFile === "icarus.ts") return "Ln 247, Col 18";
    if (activeFile === "morgan_notes.tsx") return "Ln 42, Col 7";
    return "Ln 1, Col 1";
  };

  const getFileType = () => {
    if (activeFile.endsWith('.md')) return "Markdown";
    if (activeFile.endsWith('.ts')) return "TypeScript";
    if (activeFile.endsWith('.tsx')) return "TypeScript React";
    if (activeFile.endsWith('.log')) return "Log";
    return "Plain Text";
  };

  return (
    <div className="bg-purple-600 px-3 py-0.5 flex items-center justify-between text-xs text-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch size={12} />
          <span>main*</span>
        </div>
        <div className="flex items-center space-x-1">
          <AlertTriangle className="text-yellow-400" size={12} />
          <span>3 problems</span>
        </div>
        <span>Morgan Elric [MISSING]</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>{getLineInfo()}</span>
        <span>UTF-8</span>
        <span>{getFileType()}</span>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>Connection: Lost</span>
        </div>
      </div>
    </div>
  );
}
