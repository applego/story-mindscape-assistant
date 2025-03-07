
import MainLayout from "@/layouts/MainLayout";
import StoryFlowEditor from "@/components/flowchart/StoryFlowEditor";
import CharacterPanel from "@/components/character/CharacterPanel";
import IdeaPanel from "@/components/idea/IdeaPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProviderContext } from "@/components/ThemeProvider";
import { useContext, useEffect } from "react";
import { useProjectStats } from "@/hooks/use-project-stats";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const { theme, setTheme } = useContext(ThemeProviderContext);
  const { updateCharacterCount } = useProjectStats();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  // Update character count from the data
  useEffect(() => {
    // Import the character data and update the count
    import('@/data/characterData').then(module => {
      const { exampleCharacters } = module;
      updateCharacterCount(exampleCharacters.length);
    });
  }, [updateCharacterCount]);

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <div className="p-4 pb-0 flex items-center justify-between">
          <Tabs defaultValue="plot" className="w-full h-full">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="plot">プロット作成</TabsTrigger>
                <TabsTrigger value="characters">キャラクター</TabsTrigger>
                <TabsTrigger value="ideas">アイデア</TabsTrigger>
                <TabsTrigger value="themes">テーマ設計</TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme}
                  className="h-8 w-8"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      時系列と執筆順について
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>時系列と執筆順の使い分け</DialogTitle>
                      <DialogDescription>
                        物語では、出来事の実際の時間順序（時系列）と、それを読者に提示する順序（執筆順）が異なる場合があります。
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">時系列順 (Chronological Order)</h3>
                        <p className="text-sm text-muted-foreground">
                          物語の出来事が実際に起こる順序です。フラッシュバックやフラッシュフォワードを含む物語全体の時間的な構造を把握するのに役立ちます。
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">執筆順 (Narrative Order)</h3>
                        <p className="text-sm text-muted-foreground">
                          出来事が読者に提示される順序です。フラッシュバック、パラレルストーリー、時間ジャンプなどの技法を使う場合に、実際の執筆/読書順序を管理します。
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">使い方</h3>
                        <p className="text-sm text-muted-foreground">
                          ツリービューの「時系列順」と「執筆順」ボタンを切り替えることで、異なる視点でストーリーを構成できます。「並替」ボタンでノードをドラッグ＆ドロップして順序を変更できます。
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <TabsContent value="plot" className="h-[calc(100vh-140px)]">
              <div className="h-full flex flex-col">
                <StoryFlowEditor />
              </div>
            </TabsContent>
            
            <TabsContent value="characters" className="h-[calc(100vh-140px)]">
              <CharacterPanel />
            </TabsContent>
            
            <TabsContent value="ideas" className="h-[calc(100vh-140px)]">
              <IdeaPanel />
            </TabsContent>
            
            <TabsContent value="themes" className="h-[calc(100vh-140px)]">
              <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
                <p className="text-gray-500 dark:text-gray-400">テーマ設計ツールは開発中です。次のアップデートをお待ちください。</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
