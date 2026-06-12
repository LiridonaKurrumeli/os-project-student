import { MenuBar } from "@components/MainScreen/MenuBar/MenuBar";
import { ApplicationsSection } from "@components/MainScreen/ApplicationsSection/ApplicationsSection";

export const MainScreen = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <MenuBar />
      <ApplicationsSection />
    </div>
  );
};
