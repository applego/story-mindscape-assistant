
import MainLayout from "@/layouts/MainLayout";
import StoryFlowEditor from "@/components/flowchart/StoryFlowEditor";

const Index = () => {
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <StoryFlowEditor />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
