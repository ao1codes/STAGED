import { FileText, File, Code, X } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";

interface TabBarProps {
  openTabs: string[];
  activeTab: string;
  onTabSelect: (fileName: string) => void;
  onTabClose: (fileName: string) => void;
}

const getFileIcon = (fileName: string) => {
  if (fileName.endsWith('.md')) return FileText;
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.js')) return Code;
  return File;
};

const getFileColor = (fileName: string) => {
  if (fileName.endsWith('.md')) return 'editor-purple';
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) return 'editor-success';
  if (fileName.endsWith('.log')) return 'editor-warning';
  return 'editor-accent';
};

export default function TabBar({ openTabs, activeTab, onTabSelect, onTabClose }: TabBarProps) {
  const { playSound } = useAudio();
  return (
    <div className="editor-sidebar border-b editor-border flex">
      <div className="flex">
        {openTabs.map(fileName => {
          const Icon = getFileIcon(fileName);
          const isActive = fileName === activeTab;
          const colorClass = getFileColor(fileName);
          
          return (
            <div 
              key={fileName}
              className={`px-2 py-1 border-r editor-border flex items-center space-x-1 text-xs cursor-pointer ${
                isActive ? 'editor-bg' : 'hover:bg-gray-800'
              }`}
              onClick={() => {
                playSound('tab_switch');
                onTabSelect(fileName);
              }}
            >
              <span className={`text-xs ${colorClass}`}>
                <Icon size={12} />
              </span>
              <span>{fileName}</span>
              {isActive && fileName.includes('icarus') && (
                <span className="editor-warning">●</span>
              )}
              <button
                className="editor-muted hover:editor-text ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('file_click');
                  onTabClose(fileName);
                }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
