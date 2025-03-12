
import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { FileNode } from '@/components/explorer/FileExplorerView';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileEditorProps {
  file: FileNode | null;
  onSave?: (fileId: string, content: string) => void;
  onClose?: () => void;
}

const FileEditor = ({ file, onSave, onClose }: FileEditorProps) => {
  const [content, setContent] = useState<string>('');
  const [language, setLanguage] = useState<string>('markdown');

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      
      // Determine the language based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'js':
          setLanguage('javascript');
          break;
        case 'ts':
          setLanguage('typescript');
          break;
        case 'tsx':
          setLanguage('typescript');
          break;
        case 'jsx':
          setLanguage('javascript');
          break;
        case 'json':
          setLanguage('json');
          break;
        case 'css':
          setLanguage('css');
          break;
        case 'html':
          setLanguage('html');
          break;
        default:
          setLanguage('markdown');
      }
    }
  }, [file]);

  const handleSave = () => {
    if (file && onSave) {
      onSave(file.id, content);
      toast.success(`${file.name} を保存しました`);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">ファイルを選択してください</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
        <div className="text-sm font-medium">{file.name}</div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className="h-8 gap-1"
          >
            <Save className="h-4 w-4" />
            保存
          </Button>
          {onClose && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="h-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

export default FileEditor;
