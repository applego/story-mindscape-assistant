
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, Trash, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ThemeProvider } from '@/components/ThemeProvider';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  lastModified: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load projects from localStorage
    const storedProjects = localStorage.getItem('storyflow-projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      // Set default project if none exist
      const defaultProject: Project = {
        id: 'default-project',
        title: 'マイストーリー',
        description: 'デフォルトのストーリープロジェクトです。',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setProjects([defaultProject]);
      localStorage.setItem('storyflow-projects', JSON.stringify([defaultProject]));
    }
  }, []);

  const handleCreateProject = () => {
    if (!newProject.title.trim()) {
      toast.error("プロジェクト名を入力してください");
      return;
    }

    const project: Project = {
      id: `project_${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('storyflow-projects', JSON.stringify(updatedProjects));
    
    // Reset form
    setNewProject({
      title: '',
      description: ''
    });
    
    toast.success("新しいプロジェクトを作成しました");
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) {
      toast.error("少なくとも1つのプロジェクトが必要です");
      return;
    }
    
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('storyflow-projects', JSON.stringify(updatedProjects));
    toast.success("プロジェクトを削除しました");
  };

  const handleSelectProject = (id: string) => {
    // Set current project and navigate to editor
    localStorage.setItem('current-project', id);
    navigate('/');
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-gray-50 dark:bg-storyflow-dark-gray p-6">
        <div className="max-w-7xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold dark:text-storyflow-dark-text">StoryMindscape</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              現在のプロジェクトへ戻る
            </Button>
          </header>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold dark:text-storyflow-dark-text">プロジェクト一覧</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  新しいプロジェクト
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新しいプロジェクトを作成</DialogTitle>
                  <DialogDescription>
                    新しいストーリープロジェクトの詳細を入力してください。
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">プロジェクト名</Label>
                    <Input
                      id="title"
                      placeholder="プロジェクト名を入力"
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">説明</Label>
                    <textarea
                      id="description"
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="プロジェクトの説明を入力"
                      rows={4}
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" onClick={handleCreateProject}>
                    作成
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="dark:bg-storyflow-dark-gray/60 dark:border-storyflow-dark-border">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="line-clamp-1 dark:text-storyflow-dark-text">{project.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 dark:text-gray-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>作成日: {format(new Date(project.createdAt), 'yyyy/MM/dd HH:mm', { locale: ja })}</div>
                    <div>更新日: {format(new Date(project.lastModified), 'yyyy/MM/dd HH:mm', { locale: ja })}</div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button className="w-full" onClick={() => handleSelectProject(project.id)}>
                    <FileEdit className="h-4 w-4 mr-1" />
                    選択
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};

export default Projects;
