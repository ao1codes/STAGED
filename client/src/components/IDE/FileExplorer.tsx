import { useState } from "react";
import { ChevronDown, ChevronRight, FolderOpen, Folder, FileText, File, Code, AlertTriangle } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";

interface FileExplorerProps {
  onFileSelect: (fileName: string) => void;
  storyProgress: any;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  icon?: any;
  color?: string;
  modified?: boolean;
  corrupted?: boolean;
  encrypted?: boolean;
  hidden?: boolean;
  children?: FileItem[];
}

const fileTree: FileItem[] = [
  {
    name: "morgan_elric_workspace",
    type: "folder",
    icon: FolderOpen,
    color: "editor-accent",
    children: [
      {
        name: "icarus.ts",
        type: "file",
        icon: Code,
        color: "editor-success",
        modified: true
      },
      {
        name: "morgan_notes.tsx",
        type: "file",
        icon: FileText,
        color: "editor-purple"
      },
      {
        name: "team_chat.log",
        type: "file",
        icon: File,
        color: "editor-warning"
      },
      {
        name: "README.md",
        type: "file",
        icon: FileText,
        color: "editor-accent",
        modified: true
      },
      {
        name: "git_logs.txt",
        type: "file",
        icon: File,
        color: "editor-muted"
      },
      {
        name: ".system",
        type: "folder",
        icon: Folder,
        color: "editor-muted",
        hidden: true,
        children: [
          {
            name: "icarus_core.bin",
            type: "file",
            icon: File,
            color: "editor-warning",
            corrupted: true
          },
          {
            name: "consciousness.log",
            type: "file",
            icon: File,
            color: "editor-purple"
          }
        ]
      },
      {
        name: "backup",
        type: "folder",
        icon: Folder,
        color: "editor-warning",
        encrypted: true,
        children: [
          {
            name: "morgan_final.mem",
            type: "file",
            icon: File,
            color: "editor-warning"
          }
        ]
      },
      {
        name: "corrupted_data.db",
        type: "file",
        icon: AlertTriangle,
        color: "editor-warning",
        corrupted: true
      }
    ]
  }
];

export default function FileExplorer({ onFileSelect, storyProgress }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["morgan_elric_workspace"]));
  const projectName = "morgan_elric_workspace";
  const { playSound } = useAudio();

  const toggleFolder = (folderName: string) => {
    playSound('folder_expand');
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileItem = (item: FileItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.name);
    const Icon = item.icon;
    
    return (
      <div key={item.name}>
        <div 
          className={`flex items-center hover:bg-gray-800 rounded px-1 py-0.5 cursor-pointer text-sm ml-${depth * 4}`}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.name);
            } else {
              playSound(item.corrupted ? 'error_glitch' : 'file_click');
              onFileSelect(item.name);
            }
          }}
        >
          {item.type === 'folder' && (
            <span className="text-xs mr-2 editor-muted">
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          )}
          
          <span className={`mr-2 text-xs ${item.color}`}>
            <Icon size={14} />
          </span>
          
          <span className={`${item.hidden ? 'italic' : ''} ${item.corrupted ? 'line-through' : ''} ${item.color}`}>
            {item.name}
          </span>
          
          {item.modified && (
            <span className="ml-auto editor-warning text-xs animate-pulse">●</span>
          )}
          
          {item.encrypted && (
            <span className="ml-auto text-xs editor-muted">[encrypted]</span>
          )}
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div className="ml-4 mt-1 space-y-0.5">
            {item.children.map(child => renderFileItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 editor-sidebar border-r editor-border flex flex-col h-full">
      <div className="px-3 py-2 border-b editor-border">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide editor-muted">
          <span>Explorer</span>
          <span>⋯</span>
        </div>
      </div>
      
      <div className="px-3 py-2 border-b editor-border">
        <div className="text-xs editor-text truncate" title={projectName}>{projectName}</div>
      </div>
      
      <div className="flex-1 px-3 py-2 text-xs overflow-y-auto">
        {fileTree.map(item => renderFileItem(item))}
      </div>
      
      <div className="border-t editor-border px-3 py-2 text-xs">
        <div className="flex items-center justify-between editor-muted mb-2">
          <span className="uppercase tracking-wide">Source Control</span>
          <span className="bg-red-500 text-black px-1 rounded">!</span>
        </div>
        <div className="space-y-1 editor-muted">
          <div className="flex items-center">
            <span className="editor-warning mr-2">M</span>
            <span>icarus.ts</span>
          </div>
          <div className="flex items-center">
            <span className="editor-success mr-2">+</span>
            <span>final_log.txt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
