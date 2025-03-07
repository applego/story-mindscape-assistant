
import React from 'react';
import { FileNode } from './FileExplorerView';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileContentViewerProps {
  file: FileNode | null;
}

const FileContentViewer: React.FC<FileContentViewerProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg">
        <p>ファイルを選択してください</p>
      </div>
    );
  }

  // Function to render markdown-like content more nicely
  // This is a simple implementation. For a full markdown renderer,
  // you would want to use a library like react-markdown
  const renderContent = () => {
    if (!file.content) return null;
    
    // Split by lines
    const lines = file.content.split('\n');
    
    return lines.map((line, index) => {
      // Heading 1
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
      }
      // Heading 2
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mb-3">{line.substring(3)}</h2>;
      }
      // List item
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-2">{line.substring(2)}</li>;
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={index} className="h-4"></div>;
      }
      // Regular paragraph
      return <p key={index} className="mb-3">{line}</p>;
    });
  };

  return (
    <div className="h-full border rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 flex items-center">
        <h3 className="font-medium text-sm">{file.name}</h3>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="p-4">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileContentViewer;
