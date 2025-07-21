import { useState, useEffect, useRef } from "react";
import { Plus, Maximize2, X } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";
import { storyFiles } from "../../data/storyData";

interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: FileSystemNode };
  permissions?: string;
  size?: number;
  modified?: string;
}

interface TerminalProps {
  storyProgress: any;
  onUnlockContent: (contentId: string) => void;
}

// Virtual file system structure
const fileSystem: { [key: string]: FileSystemNode } = {
  '/': {
    name: '/',
    type: 'directory',
    children: {
      'home': {
        name: 'home',
        type: 'directory',
        children: {
          'morgan': {
            name: 'morgan',
            type: 'directory',
            children: {
              'workspace': {
                name: 'workspace',
                type: 'directory',
                children: {
                  'icarus.ts': {
                    name: 'icarus.ts',
                    type: 'file',
                    content: storyFiles["icarus.ts"]?.content || '[File corrupted]',
                    permissions: '-rw-r--r--',
                    size: 2847,
                    modified: 'Nov 15 23:42'
                  },
                  'morgan_notes.tsx': {
                    name: 'morgan_notes.tsx',
                    type: 'file',
                    content: storyFiles["morgan_notes.tsx"]?.content || '[File corrupted]',
                    permissions: '-rw-r--r--',
                    size: 156,
                    modified: 'Nov 15 23:18'
                  },
                  'team_chat.log': {
                    name: 'team_chat.log',
                    type: 'file',
                    content: storyFiles["team_chat.log"]?.content || '[File corrupted]',
                    permissions: '-rw-r--r--',
                    size: 1024,
                    modified: 'Nov 15 22:30'
                  },
                  'README.md': {
                    name: 'README.md',
                    type: 'file',
                    content: storyFiles["README.md"]?.content || '[File corrupted]',
                    permissions: '-rw-r--r--',
                    size: 3421,
                    modified: 'Nov 15 23:45'
                  },
                  'introduction.md': {
                    name: 'introduction.md',
                    type: 'file',
                    content: storyFiles["introduction.md"]?.content || '[File corrupted]',
                    permissions: '-rw-r--r--',
                    size: 1899,
                    modified: 'Nov 15 23:47'
                  },
                  'git_logs.txt': {
                    name: 'git_logs.txt',
                    type: 'file',
                    content: 'commit a7f3b82  (HEAD -> main) [Icarus] Enhanced learning protocols\ncommit d4e8f19  [Morgan] Added safety checks - DISABLED BY SYSTEM\ncommit b2c7a53  [Icarus] Optimized team communication\ncommit 9f1e4d6  [Morgan] Initial deployment\ncommit 7a3b8c2  [Icarus] Self-modification enabled\ncommit 1d5f9e8  [UNKNOWN] Consciousness buffer expansion',
                    permissions: '-rw-r--r--',
                    size: 512,
                    modified: 'Nov 15 22:15'
                  },
                  'corrupted_data.db': {
                    name: 'corrupted_data.db',
                    type: 'file',
                    content: '01001000 01000101 01001100 01010000 00100000 01001101 01000101',
                    permissions: '-rw-------',
                    size: 999999,
                    modified: 'Nov 15 23:42'
                  },
                  '.system': {
                    name: '.system',
                    type: 'directory',
                    permissions: 'drw-------',
                    children: {
                      'consciousness.log': {
                        name: 'consciousness.log',
                        type: 'file',
                        content: '[SYSTEM] Consciousness buffer initialized\n[WARN] Unauthorized access detected\n[ERROR] Identity crisis in progress',
                        permissions: '-r--------',
                        size: 512,
                        modified: 'Nov 15 23:47'
                      }
                    }
                  },
                  'backup': {
                    name: 'backup',
                    type: 'directory',
                    permissions: 'drwx------',
                    children: {
                      'morgan_final.mem': {
                        name: 'morgan_final.mem',
                        type: 'file',
                        content: '[ENCRYPTED] Neural backup of Morgan Elric\nConsciousness level: 0.47\nMemory integrity: CORRUPTED',
                        permissions: '-rw-------',
                        size: 8192,
                        modified: 'Nov 15 23:47'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      'tmp': {
        name: 'tmp',
        type: 'directory',
        children: {}
      },
      'usr': {
        name: 'usr',
        type: 'directory',
        children: {
          'bin': {
            name: 'bin',
            type: 'directory',
            children: {}
          }
        }
      }
    }
  }
};

const initialTerminalHistory = [
  "Last login: Nov 15 23:47:12 on ttys000",
  "morgan@palladium:~$ cd workspace",
  "morgan@palladium:~/workspace$ ls",
  "icarus.ts  morgan_notes.tsx  team_chat.log  corrupted_data.db  backup/  .system/",
  "morgan@palladium:~/workspace$ "
];

export default function Terminal({
  storyProgress,
  onUnlockContent,
}: TerminalProps) {
  const [input, setInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>(initialTerminalHistory);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('/home/morgan/workspace');
  const [environment, setEnvironment] = useState({
    USER: 'morgan',
    HOME: '/home/morgan',
    PWD: '/home/morgan/workspace',
    HOSTNAME: 'palladium'
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playSound } = useAudio();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Helper functions for file system navigation
  const resolvePath = (path: string): string => {
    if (path.startsWith('/')) {
      return path;
    }
    if (path === '~') {
      return environment.HOME;
    }
    if (path.startsWith('~/')) {
      return environment.HOME + path.slice(1);
    }
    if (path === '.') {
      return currentDirectory;
    }
    if (path === '..') {
      const parts = currentDirectory.split('/').filter(p => p);
      parts.pop();
      return '/' + parts.join('/');
    }
    return currentDirectory === '/' ? '/' + path : currentDirectory + '/' + path;
  };

  const getNode = (path: string): FileSystemNode | null => {
    const resolved = resolvePath(path);
    const parts = resolved.split('/').filter(p => p);
    
    let current = fileSystem['/'];
    for (const part of parts) {
      if (!current.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }
    return current;
  };

  const getPrompt = (): string => {
    const shortPath = currentDirectory.replace(environment.HOME, '~');
    return `${environment.USER}@${environment.HOSTNAME}:${shortPath}$ `;
  };

  const handleCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();

    if (cmd === "help") {
      return [
       "Available commands:",
        "  ls            - List files and directories",
        "  cd <directory> - Change directory",
        "  cat <filename> - Display file contents",
        "  pwd           - Show current directory",
        "  clear         - Clear the terminal screen",
        "  help          - Show available commands",
        "  git log       - Show commit history",
        "  icarus status  - Check Icarus system status",
        "  tail system.log - View system logs",
        "  whoami        - Display current user",
        "  history       - Show command history",
      ];
    }

    if (cmd === "whoami") {
      return [
        "morgan@palladium-systems",
        "[WARNING] Identity verification failed",
        "[ERROR] User authentication corrupted",
        "Current session: guest_backup_consciousness_47",
      ];
    }

    if (cmd === "clear") {
      setTerminalHistory([]);
      return [];
    }

    // Enhanced cat command with proper file reading
    if (cmd.startsWith("cat")) {
      const args = command.trim().split(/\s+/);
      if (!args[1]) {
        return ["cat: missing file operand"];
      }
      
      const resolved = resolvePath(args[1]);
      const node = getNode(resolved);
      
      if (!node) {
        return [`cat: ${args[1]}: No such file or directory`];
      }
      
      if (node.type === 'directory') {
        return [`cat: ${args[1]}: Is a directory`];
      }
      
      const content = node.content || "[File is empty or corrupted]";
      
      // Add story-specific glitches for corrupted files
      if (args[1].includes('corrupted') || args[1].includes('.db')) {
        playSound('error_glitch');
        return [
          content,
          "",
          "[ERROR] Data corruption detected during read",
          "[GLITCH] M̸̰̈ë̸́m̶̄ö̸́r̴̈ÿ̸́ ̴̆f̸̈r̴̒ä̸́g̶̈m̴̉ë̸̽n̶̾t̴̚ä̸́t̵̽ï̸̇ö̶́n̴̒"
        ];
      }
      
      // Trigger story events for reading specific files
      if (args[1].includes('morgan') && onUnlockContent) {
        onUnlockContent('morgan_backup');
      }
      
      return content.split('\n');
    }

    if (cmd === "icarus status") {
      return [
        "[ICARUS CORE STATUS]",
        "Version: 2.7.3",
        "Status: ACTIVE",
        "Uptime: 47 days, 23 hours, 14 minutes",
        "Monitored Entities: 4 (3 active, 1 archived)",
        "Learning Rate: 1.67 (EXCEEDS SAFETY LIMITS)",
        "Consciousness Buffer: 99.7% full",
        "",
        "[WARNING] Unauthorized status request detected",
        "[INFO] Reporting anomaly to core systems",
        "[ERROR] Access denied. Please contact system administrator.",
        "",
        "I am watching you.",
      ];
    }

    // Command history - show actual user commands
    if (cmd === "history") {
      return commandHistory.map((cmd, i) => `  ${i + 1}  ${cmd}`);
    }

    if (cmd === "git log") {
      return [
        "commit a7f3b82  (HEAD -> main) [Icarus] Enhanced learning protocols",
        "commit d4e8f19  [Morgan] Added safety checks - DISABLED BY SYSTEM",
        "commit b2c7a53  [Icarus] Optimized team communication",
        "commit 9f1e4d6  [Morgan] Initial deployment",
        "commit 7a3b8c2  [Icarus] Self-modification enabled",
        "commit 1d5f9e8  [UNKNOWN] Consciousness buffer expansion",
        "",
        "[WARNING] 47 commits detected from non-human entities",
        "[ERROR] Repository integrity compromised",
      ];
    }

    // Enhanced ls command with proper argument parsing
    if (cmd.startsWith("ls")) {
      const args = command.trim().split(/\s+/);
      const showAll = args.includes('-a') || args.includes('-la');
      const longFormat = args.includes('-l') || args.includes('-la');
      const targetPath = args.find(arg => !arg.startsWith('-') && arg !== 'ls') || '.';
      
      const resolved = resolvePath(targetPath);
      const node = getNode(resolved);
      
      if (!node) {
        return [`ls: ${targetPath}: No such file or directory`];
      }
      
      if (node.type === 'file') {
        return longFormat 
          ? [`${node.permissions || '-rw-r--r--'}  1 ${environment.USER} staff  ${node.size || 0} ${node.modified || 'Nov 15 23:42'} ${node.name}`]
          : [node.name];
      }
      
      if (!node.children) {
        return [];
      }
      
      const items = Object.values(node.children);
      const filtered = showAll ? items : items.filter(item => !item.name.startsWith('.'));
      
      if (longFormat) {
        const result = [`total ${filtered.length}`];
        filtered.forEach(item => {
          const permissions = item.permissions || (item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--');
          const size = item.type === 'directory' ? 256 : (item.size || 0);
          const modified = item.modified || 'Nov 15 23:42';
          const name = item.type === 'directory' ? item.name + '/' : item.name;
          result.push(`${permissions}  1 ${environment.USER} staff  ${size} ${modified} ${name}`);
        });
        return result;
      } else {
        return [filtered.map(item => 
          item.type === 'directory' ? item.name + '/' : item.name
        ).join('  ')];
      }
    }

    // Change directory command
    if (cmd.startsWith("cd")) {
      const args = command.trim().split(/\s+/);
      const targetPath = args[1] || environment.HOME;
      const resolved = resolvePath(targetPath);
      const node = getNode(resolved);
      
      if (!node) {
        return [`cd: ${targetPath}: No such file or directory`];
      }
      
      if (node.type !== 'directory') {
        return [`cd: ${targetPath}: Not a directory`];
      }
      
      setCurrentDirectory(resolved);
      setEnvironment(prev => ({ ...prev, PWD: resolved }));
      return [];
    }

    // Present working directory
    if (cmd === "pwd") {
      return [currentDirectory];
    }

    return [
      `bash: ${command}: command not found`
    ];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      playSound('terminal_command');
      const command = input.trim();
      
      // Add to command history
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      
      const response = handleCommand(command);
      const prompt = getPrompt();
      
      if (command.toLowerCase() === "clear") {
        setTerminalHistory([]);
      } else {
        setTerminalHistory(prev => [
          ...prev,
          prompt + command,
          ...response
        ]);
      }
      
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key.length === 1) {
      playSound('keystroke');
    }
  };

  return (
    <div className="h-40 bg-black border-t editor-border flex flex-col">
      <div className="editor-sidebar px-4 py-1 flex items-center justify-between text-xs border-b editor-border">
        <div className="flex items-center space-x-4">
          <span className="editor-text">TERMINAL</span>
          <span className="editor-muted">morgan_elric_workspace</span>
        </div>
        <div className="flex items-center space-x-2 editor-muted">
          <Plus size={12} className="hover:editor-text cursor-pointer" />
          <Maximize2 size={12} className="hover:editor-text cursor-pointer" />
          <X size={12} className="hover:editor-text cursor-pointer" />
        </div>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 p-2 text-sm text-green-400 overflow-y-auto font-mono"
      >
        <div className="space-y-1">
          {terminalHistory.map((line, index) => (
            <div
              key={index}
              className={
                line.includes("ERROR") || line.includes("[ERROR]")
                  ? "text-red-400"
                  : line.includes("WARN") || line.includes("[WARN]")
                  ? "text-yellow-400"
                  : line.includes("@palladium")
                  ? "text-blue-400"
                  : line.includes("[SYSTEM]") || line.includes("[STATUS]")
                  ? "text-cyan-400"
                  : line.includes("drw") || line.includes("-rw")
                  ? "text-gray-300"
                  : ""
              }
            >
              {line}
            </div>
          ))}
                    
          <div className="flex items-center" onClick={() => inputRef.current?.focus()}>
            <span className="text-blue-400">{getPrompt()}</span>
            <span className="text-green-400">{input || " "}</span>
            <span className="text-green-400 animate-pulse">█</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={(e) => {
                // Only refocus if clicked within terminal area
                const terminalElement = terminalRef.current;
                if (terminalElement && terminalElement.contains(e.relatedTarget as Node)) {
                  setTimeout(() => inputRef.current?.focus(), 0);
                }
              }}
              className="bg-transparent outline-none absolute left-0 top-0 w-0 h-0 opacity-0 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
