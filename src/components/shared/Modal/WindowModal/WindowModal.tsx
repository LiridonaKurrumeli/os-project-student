import { DefaultModal } from "../DefaultModal/DefaultModal";
import { WindowType } from "@context/WindowContext/WindowContext";

import { Camera } from "@components/Applications/Camera/Camera";
import { Browser } from "@components/Applications/Browser/Browser";
import { Documents } from "@components/Applications/Documents/Documents";
import { Preferences } from "@components/Applications/Preferences/Preferences";
import { NewsApp } from "@components/Applications/News/NewsApp";
import { GalleryApp } from "@components/Applications/Gallery/GalleryApp";
import { Weather } from "@components/Applications/Weather/Weather";
import { Calculator } from "@components/Applications/Calculator/Calculator";
import { Notes } from "@components/Applications/Notes/Notes";
import { Calendar } from "@components/Applications/Calendar/Calendar";
import { Clock } from "@components/Applications/Clock/Clock";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  component: WindowType | null;
}

const WindowComponents: { [key in WindowType]: React.FunctionComponent<{}> } = {
  browser: Browser,
  camera: Camera,
  gallery: GalleryApp,
  folder: Documents,
  news: NewsApp,
  preference: Preferences,
  weather: Weather,
  calculator: Calculator,
  notes: Notes,
  calendar: Calendar,
  clock: Clock,
};

export const WindowModal = ({ isVisible, onClose, component }: Props) => {
  const Component = component ? WindowComponents[component] : () => <></>;

  return (
    <DefaultModal isVisible={isVisible} onClose={onClose}>
      <div className="flex w-full h-full max-h-[800px] max-w-[1400px]">
        <div className="flex flex-col w-full h-full overflow-hidden bg-[#c0c9d1] dark:bg-gray-900 rounded-xl">
          <div className="w-full h-5 px-[6px] flex items-center justify-end">
            <div
              className="w-3 h-3 bg-red-500 rounded-full cursor-pointer"
              onClick={onClose}
            ></div>
          </div>
          <Component />
        </div>
      </div>
    </DefaultModal>
  );
};
