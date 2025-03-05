
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthorInfo, defaultAuthorInfo } from '@/utils/storyGenerationUtils';
import { Plus, Trash2 } from 'lucide-react';

interface AuthorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorInfo: AuthorInfo;
  onSave: (authorInfo: AuthorInfo) => void;
}

const AuthorSettingsModal: React.FC<AuthorSettingsModalProps> = ({
  isOpen,
  onClose,
  authorInfo,
  onSave,
}) => {
  const [name, setName] = useState(authorInfo.name);
  const [style, setStyle] = useState(authorInfo.style);
  const [genres, setGenres] = useState<string[]>(authorInfo.preferredGenres);
  const [newGenre, setNewGenre] = useState('');
  const [writingPrompt, setWritingPrompt] = useState(authorInfo.writingPrompt);

  const handleAddGenre = () => {
    if (newGenre.trim() !== '' && !genres.includes(newGenre.trim())) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (index: number) => {
    setGenres(genres.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const updatedAuthorInfo: AuthorInfo = {
      name: name.trim() || defaultAuthorInfo.name,
      style: style.trim() || defaultAuthorInfo.style,
      preferredGenres: genres.length > 0 ? genres : defaultAuthorInfo.preferredGenres,
      writingPrompt: writingPrompt.trim() || defaultAuthorInfo.writingPrompt,
    };

    onSave(updatedAuthorInfo);
    onClose();
  };

  const handleReset = () => {
    setName(defaultAuthorInfo.name);
    setStyle(defaultAuthorInfo.style);
    setGenres([...defaultAuthorInfo.preferredGenres]);
    setWritingPrompt(defaultAuthorInfo.writingPrompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>作家設定</DialogTitle>
          <DialogDescription>
            文章生成時に反映される作家の情報とスタイルを設定します。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              作家名
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="作家名を入力"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="style" className="text-right">
              スタイル
            </Label>
            <Input
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="col-span-3"
              placeholder="描写的、ミニマリスト、会話重視など"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              好みのジャンル
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="新しいジャンルを追加"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  onClick={handleAddGenre}
                  disabled={newGenre.trim() === ''}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <span>{genre}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGenre(index)}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="writing-prompt" className="text-right">
              文体指示
            </Label>
            <Textarea
              id="writing-prompt"
              value={writingPrompt}
              onChange={(e) => setWritingPrompt(e.target.value)}
              className="col-span-3 min-h-[100px]"
              placeholder="どのような文体で生成するかの指示を入力"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" type="button" onClick={handleReset}>
            デフォルトに戻す
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="button" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthorSettingsModal;
