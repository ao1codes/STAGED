import { useEffect, useState } from "react";
import { storyFiles } from "../../data/storyData";

interface CodeEditorProps {
  fileName: string;
  storyProgress: any;
  onUnlockContent: (contentId: string) => void;
}

export default function CodeEditor({ fileName, storyProgress, onUnlockContent }: CodeEditorProps) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fileData = storyFiles[fileName];
    if (fileData) {
      setContent(fileData.content);
      const lines = fileData.content.split('\n');
      setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
    }
  }, [fileName]);

  const renderContent = () => {
    const fileData = storyFiles[fileName];
    if (!fileData) return <div className="editor-muted">File not found</div>;

    return (
      <div className="space-y-1" dangerouslySetInnerHTML={{ __html: fileData.renderedContent }} />
    );
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Line Numbers */}
      <div className="editor-bg border-r editor-border px-3 py-4 editor-muted text-sm select-none min-w-[60px]">
        <div className="space-y-0.5">
          {lineNumbers.map(num => (
            <div key={num} className="text-right">{num}</div>
          ))}
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 editor-bg p-4 text-sm leading-relaxed overflow-y-auto">
        <div className="min-h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
