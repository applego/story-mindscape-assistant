
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, User, Users, Trash2 } from "lucide-react";
import { syncCharactersToFileTree } from "@/data/fileExplorerData";
import { useProjectStats } from "@/hooks/use-project-stats";
import { toast } from "sonner";
import { Character } from "@/data/characterData";

const CharacterPanel = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCharacter, setNewCharacter] = useState<Omit<Character, 'id'>>({
    name: '',
    personality: '',
    strengths: '',
    weaknesses: '',
    background: '',
    role: ''
  });
  const { updateCharacterCount } = useProjectStats();

  // ローカルストレージからキャラクターデータをロード
  useEffect(() => {
    try {
      const savedCharacters = localStorage.getItem('characters');
      if (savedCharacters) {
        const parsedCharacters = JSON.parse(savedCharacters);
        setCharacters(parsedCharacters);
        updateCharacterCount(parsedCharacters.length);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  }, [updateCharacterCount]);

  // キャラクターの変更をファイルエクスプローラーに同期
  useEffect(() => {
    if (characters.length > 0) {
      syncCharactersToFileTree(characters);
      localStorage.setItem('characters', JSON.stringify(characters));
      updateCharacterCount(characters.length);
    }
  }, [characters, updateCharacterCount]);

  const handleCreateCharacter = () => {
    const character: Character = {
      ...newCharacter,
      id: Date.now().toString()
    };
    
    const updatedCharacters = [...characters, character];
    setCharacters(updatedCharacters);
    setSelectedCharacter(character);
    setIsCreating(false);
    setNewCharacter({
      name: '',
      personality: '',
      strengths: '',
      weaknesses: '',
      background: '',
      role: ''
    });
    
    toast.success('キャラクターを作成しました');
  };

  const handleDeleteCharacter = (id: string) => {
    const updatedCharacters = characters.filter(char => char.id !== id);
    setCharacters(updatedCharacters);
    
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(updatedCharacters.length > 0 ? updatedCharacters[0] : null);
    }
    
    toast.success('キャラクターを削除しました');
  };

  const handleInputChange = (field: keyof Omit<Character, 'id'>, value: string) => {
    if (isCreating) {
      setNewCharacter({
        ...newCharacter,
        [field]: value
      });
    } else if (selectedCharacter) {
      const updatedCharacter = { ...selectedCharacter, [field]: value };
      setSelectedCharacter(updatedCharacter);
      setCharacters(characters.map(char => 
        char.id === selectedCharacter.id ? updatedCharacter : char
      ));
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      <div className="col-span-1 border rounded-lg bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <h3 className="font-medium">キャラクター一覧</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => {
              setIsCreating(true);
              setSelectedCharacter(null);
            }}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {characters.length === 0 && !isCreating ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>キャラクターがまだ作成されていません</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => setIsCreating(true)}
                >
                  新しいキャラクターを作成
                </Button>
              </div>
            ) : (
              characters.map((character) => (
                <div 
                  key={character.id}
                  className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                    selectedCharacter?.id === character.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedCharacter(character);
                    setIsCreating(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{character.name || '名前なし'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCharacter(character.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="col-span-2 border rounded-lg bg-white p-4">
        {isCreating ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">新しいキャラクターを作成</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">名前</label>
                <Input 
                  value={newCharacter.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  placeholder="キャラクターの名前"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">「○○すぎる」性格</label>
                <Input 
                  value={newCharacter.personality} 
                  onChange={(e) => handleInputChange('personality', e.target.value)} 
                  placeholder="例: 正義感が強すぎる、優しすぎる、疑り深すぎる..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">長所（憧れ性）</label>
                  <Textarea 
                    value={newCharacter.strengths} 
                    onChange={(e) => handleInputChange('strengths', e.target.value)} 
                    placeholder="周囲が憧れる性質"
                    className="h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">短所（共通性）</label>
                  <Textarea 
                    value={newCharacter.weaknesses} 
                    onChange={(e) => handleInputChange('weaknesses', e.target.value)} 
                    placeholder="読者が共感できる弱さ"
                    className="h-20"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">背景</label>
                <Textarea 
                  value={newCharacter.background} 
                  onChange={(e) => handleInputChange('background', e.target.value)} 
                  placeholder="キャラクターの過去や背景"
                  className="h-20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">物語での役割</label>
                <Input 
                  value={newCharacter.role} 
                  onChange={(e) => handleInputChange('role', e.target.value)} 
                  placeholder="例: 主人公、敵役、メンター、協力者..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>キャンセル</Button>
                <Button onClick={handleCreateCharacter}>作成</Button>
              </div>
            </div>
          </div>
        ) : selectedCharacter ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{selectedCharacter.name || '名前なし'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">名前</label>
                <Input 
                  value={selectedCharacter.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                  placeholder="キャラクターの名前"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">「○○すぎる」性格</label>
                <Input 
                  value={selectedCharacter.personality} 
                  onChange={(e) => handleInputChange('personality', e.target.value)} 
                  placeholder="例: 正義感が強すぎる、優しすぎる、疑り深すぎる..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">長所（憧れ性）</label>
                  <Textarea 
                    value={selectedCharacter.strengths} 
                    onChange={(e) => handleInputChange('strengths', e.target.value)} 
                    className="h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">短所（共通性）</label>
                  <Textarea 
                    value={selectedCharacter.weaknesses} 
                    onChange={(e) => handleInputChange('weaknesses', e.target.value)} 
                    className="h-20"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">背景</label>
                <Textarea 
                  value={selectedCharacter.background} 
                  onChange={(e) => handleInputChange('background', e.target.value)} 
                  className="h-20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">物語での役割</label>
                <Input 
                  value={selectedCharacter.role} 
                  onChange={(e) => handleInputChange('role', e.target.value)} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="w-96">
              <CardHeader>
                <CardTitle>キャラクター設定</CardTitle>
                <CardDescription>登場人物の個性や魅力を作り込みましょう</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  左側のリストからキャラクターを選択するか、「+」ボタンをクリックして新しいキャラクターを追加してください。
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => setIsCreating(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  新しいキャラクターを作成
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterPanel;
