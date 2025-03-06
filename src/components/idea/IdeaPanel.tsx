
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash, Link, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

const IdeaPanel = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newIdea, setNewIdea] = useState<Omit<Idea, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    tags: []
  });
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [tagInput, setTagInput] = useState('');
  
  // Load ideas from localStorage on initial render
  useEffect(() => {
    const storedIdeas = localStorage.getItem('ideas');
    if (storedIdeas) {
      setIdeas(JSON.parse(storedIdeas));
    }

    // Update idea count in localStorage
    const updateIdeaCount = () => {
      localStorage.setItem('ideaCount', ideas.length.toString());
      // Dispatch custom event to notify sidebar of changes
      const event = new Event('flowSaved');
      window.dispatchEvent(event);
    };

    updateIdeaCount();
  }, [ideas.length]);

  // Filtered ideas based on search query
  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Add a new idea
  const handleAddIdea = () => {
    if (!newIdea.title.trim()) {
      toast.error("アイデアのタイトルを入力してください");
      return;
    }

    const idea: Idea = {
      id: `idea_${Date.now()}`,
      title: newIdea.title.trim(),
      description: newIdea.description.trim(),
      tags: newIdea.tags,
      createdAt: new Date().toISOString()
    };

    const updatedIdeas = [...ideas, idea];
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
    localStorage.setItem('ideaCount', updatedIdeas.length.toString());
    
    // Reset form
    setNewIdea({
      title: '',
      description: '',
      tags: []
    });
    
    toast.success("新しいアイデアを追加しました");
  };

  // Delete an idea
  const handleDeleteIdea = (id: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== id);
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
    localStorage.setItem('ideaCount', updatedIdeas.length.toString());
    toast.success("アイデアを削除しました");
  };

  // Add tag to new idea
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setNewIdea({
      ...newIdea,
      tags: [...newIdea.tags, tagInput.trim()]
    });
    setTagInput('');
  };

  // Remove tag from new idea
  const handleRemoveTag = (tagToRemove: string) => {
    setNewIdea({
      ...newIdea,
      tags: newIdea.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-storyflow-dark-text">アイデア管理</h2>
        
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="アイデアを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                新しいアイデア
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>新しいアイデアを追加</DialogTitle>
                <DialogDescription>
                  物語の展開やキャラクター、設定など、あなたのアイデアを記録しましょう。
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">タイトル</Label>
                  <Input
                    id="title"
                    placeholder="アイデアのタイトル"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">説明</Label>
                  <textarea
                    id="description"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="アイデアの詳細を書いてください"
                    rows={4}
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">タグ</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="タグを追加 (Enter で追加)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      追加
                    </Button>
                  </div>
                  
                  {newIdea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newIdea.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-primary/60 hover:text-primary"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" onClick={handleAddIdea}>
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea) => (
            <Card key={idea.id} className="dark:bg-storyflow-dark-gray dark:border-storyflow-dark-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium dark:text-storyflow-dark-text flex justify-between items-start">
                  <span className="line-clamp-1">{idea.title}</span>
                  <div className="flex space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{idea.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="whitespace-pre-wrap dark:text-storyflow-dark-text">
                            {idea.description}
                          </div>
                          {idea.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-4">
                              {idea.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteIdea(idea.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        navigator.clipboard.writeText(`[アイデア参照: ${idea.title}]`);
                        toast.success("アイデアの参照を複製しました");
                      }}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {idea.description}
                </p>
              </CardContent>
              
              {idea.tags.length > 0 && (
                <CardFooter className="flex flex-wrap gap-1 pt-0">
                  {idea.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </CardFooter>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? "検索結果がありません" : "アイデアがまだありません。「新しいアイデア」ボタンから追加してください。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdeaPanel;
