
import React, { useEffect, useState } from 'react';
import { Folder, File, ChevronDown, ChevronRight, Plus, Trash2, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { toast } from 'sonner';
import { saveFileTree } from '@/data/fileExplorerData';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface FileExplorerViewProps {
  initialData: FileNode[];
  onFileSelect?: (file: FileNode) => void;
  onFileTreeChange?: (fileTree: FileNode[]) => void;
}

const FileExplorerView: React.FC<FileExplorerViewProps> = ({ 
  initialData,
  onFileSelect,
  onFileTreeChange 
}) => {
  const [fileTree, setFileTree] = useState<FileNode[]>(initialData);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingIn, setIsCreatingIn] = useState<string | null>(null);
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  
  // Update fileTree when initialData changes
  useEffect(() => {
    setFileTree(initialData);
  }, [initialData]);
  
  // Update parent component when fileTree changes
  useEffect(() => {
    if (onFileTreeChange && fileTree.length > 0) {
      onFileTreeChange(fileTree);
    }
  }, [fileTree, onFileTreeChange]);

  // Auto-expand all folders on initial load
  useEffect(() => {
    const expandAllFolders = (nodes: FileNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'folder') {
          setExpandedFolders(prev => {
            const newSet = new Set(prev);
            newSet.add(node.id);
            return newSet;
          });
          
          if (node.children) {
            expandAllFolders(node.children);
          }
        }
      });
    };
    
    if (initialData.length > 0) {
      expandAllFolders(initialData);
    }
  }, [initialData]);
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };
  
  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file' && onFileSelect) {
      onFileSelect(file);
    }
  };
  
  const startCreatingItem = (parentId: string, type: 'file' | 'folder') => {
    setIsCreatingIn(parentId);
    setNewItemType(type);
    setNewItemName('');
  };
  
  const cancelCreating = () => {
    setIsCreatingIn(null);
  };
  
  const addItem = () => {
    if (!newItemName.trim()) {
      toast.error('名前を入力してください');
      return;
    }
    
    const newId = `${newItemType}-${Date.now()}`;
    const newItem: FileNode = {
      id: newId,
      name: newItemType === 'file' ? `${newItemName}.md` : newItemName,
      type: newItemType,
      children: newItemType === 'folder' ? [] : undefined,
      content: newItemType === 'file' ? `# ${newItemName}\n\n内容を入力してください。` : undefined
    };
    
    // Root level
    if (isCreatingIn === 'root') {
      const updatedTree = [...fileTree, newItem];
      setFileTree(updatedTree);
      setIsCreatingIn(null);
      toast.success(`${newItemType === 'folder' ? 'フォルダ' : 'ファイル'}を作成しました`);
      return;
    }
    
    // Add to specific folder
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === isCreatingIn) {
          return {
            ...node,
            children: [...(node.children || []), newItem]
          };
        }
        
        if (node.children) {
          return {
            ...node,
            children: updateTree(node.children)
          };
        }
        
        return node;
      });
    };
    
    const updatedTree = updateTree(fileTree);
    setFileTree(updatedTree);
    setIsCreatingIn(null);
    
    // Automatically expand the folder when adding a new item
    if (isCreatingIn !== 'root') {
      setExpandedFolders(prev => {
        const newSet = new Set(prev);
        newSet.add(isCreatingIn!);
        return newSet;
      });
    }
    
    toast.success(`${newItemType === 'folder' ? 'フォルダ' : 'ファイル'}を作成しました`);
  };
  
  const deleteItem = (itemId: string) => {
    const removeItem = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter(node => {
        if (node.id === itemId) {
          return false;
        }
        
        if (node.children) {
          node.children = removeItem(node.children);
        }
        
        return true;
      });
    };
    
    const updatedTree = removeItem(fileTree);
    setFileTree(updatedTree);
    toast.success('削除しました');
  };
  
  const renderTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} style={{ paddingLeft: `${level * 12}px` }}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div 
              className={`flex items-center py-1 px-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                node.type === 'file' ? 'text-gray-700 dark:text-gray-300' : 'font-medium text-gray-800 dark:text-gray-200'
              }`}
            >
              {node.type === 'folder' && (
                <button 
                  onClick={() => toggleFolder(node.id)}
                  className="mr-0.5 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  {expandedFolders.has(node.id) ? 
                    <ChevronDown className="h-3.5 w-3.5" /> : 
                    <ChevronRight className="h-3.5 w-3.5" />
                  }
                </button>
              )}
              
              {node.type === 'folder' && <Folder className="h-4 w-4 text-blue-500 mr-1.5" />}
              {node.type === 'file' && <File className="h-4 w-4 text-yellow-500 mr-1.5" />}
              
              <span 
                className="truncate"
                onClick={() => node.type === 'file' && handleFileClick(node)}
              >
                {node.name}
              </span>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {node.type === 'folder' && (
              <>
                <ContextMenuItem onSelect={() => startCreatingItem(node.id, 'file')}>
                  <FileEdit className="h-4 w-4 mr-2" />
                  新規ファイル
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => startCreatingItem(node.id, 'folder')}>
                  <Folder className="h-4 w-4 mr-2" />
                  新規フォルダ
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => deleteItem(node.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </ContextMenuItem>
              </>
            )}
            
            {node.type === 'file' && (
              <ContextMenuItem onSelect={() => deleteItem(node.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
        
        {node.type === 'folder' && expandedFolders.has(node.id) && (
          <>
            {isCreatingIn === node.id && (
              <div className="flex items-center py-1" style={{ paddingLeft: `${(level + 1) * 12}px` }}>
                {newItemType === 'folder' ? 
                  <Folder className="h-4 w-4 text-blue-500 mr-1.5" /> : 
                  <File className="h-4 w-4 text-yellow-500 mr-1.5" />
                }
                <Input
                  autoFocus
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addItem();
                    if (e.key === 'Escape') cancelCreating();
                  }}
                  className="h-6 py-1 text-xs"
                  placeholder={newItemType === 'folder' ? 'フォルダ名' : 'ファイル名'}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-1.5 ml-1"
                  onClick={addItem}
                >
                  保存
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-1.5"
                  onClick={cancelCreating}
                >
                  キャンセル
                </Button>
              </div>
            )}
            {node.children && renderTree(node.children, level + 1)}
          </>
        )}
      </div>
    ));
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium">ファイルエクスプローラー</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => startCreatingItem('root', 'file')}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => startCreatingItem('root', 'folder')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2">
          {renderTree(fileTree)}
          
          {isCreatingIn === 'root' && (
            <div className="flex items-center py-1 px-2">
              {newItemType === 'folder' ? 
                <Folder className="h-4 w-4 text-blue-500 mr-1.5" /> : 
                <File className="h-4 w-4 text-yellow-500 mr-1.5" />
              }
              <Input
                autoFocus
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem();
                  if (e.key === 'Escape') cancelCreating();
                }}
                className="h-6 py-1 text-xs"
                placeholder={newItemType === 'folder' ? 'フォルダ名' : 'ファイル名'}
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-1.5 ml-1"
                onClick={addItem}
              >
                保存
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-1.5"
                onClick={cancelCreating}
              >
                キャンセル
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileExplorerView;
