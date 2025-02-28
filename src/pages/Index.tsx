
import MainLayout from "@/layouts/MainLayout";
import StoryFlowEditor from "@/components/flowchart/StoryFlowEditor";
import CharacterPanel from "@/components/character/CharacterPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <Tabs defaultValue="plot" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="plot">プロット作成</TabsTrigger>
              <TabsTrigger value="characters">キャラクター</TabsTrigger>
              <TabsTrigger value="themes">テーマ設計</TabsTrigger>
            </TabsList>
            
            <Separator className="my-2" />
            
            <TabsContent value="plot" className="h-[calc(100vh-140px)]">
              <StoryFlowEditor />
            </TabsContent>
            
            <TabsContent value="characters" className="h-[calc(100vh-140px)]">
              <CharacterPanel />
            </TabsContent>
            
            <TabsContent value="themes" className="h-[calc(100vh-140px)]">
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-dashed">
                <p className="text-gray-500">テーマ設計ツールは開発中です。次のアップデートをお待ちください。</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
