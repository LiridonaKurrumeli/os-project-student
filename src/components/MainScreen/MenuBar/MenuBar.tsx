import { useWindowContext } from "@context/WindowContext/WindowContext";
import { CurrentTime } from "@components/CurrentTime/CurrentTime";
import { BatteryLife } from "@components/BatteryLife/BatteryLife";
import { Icon } from "@components/shared/Icon/Icon";

export const MenuBar = () => {
  const { openWindow } = useWindowContext();

  const handleOpenPreferences = () => {
    console.log("Opening Preferences...");
    openWindow("preference");
  };

  return (
    <div className="flex justify-between items-center px-2 w-full h-[25px] bg-grey text-black">
      <span
        onClick={handleOpenPreferences}
        className="flex items-center gap-2 text-xs font-bold cursor-pointer"
      >
        <Icon icon="settings" />
        Preferences
      </span>
      <div className="flex items-center">
        <BatteryLife />
        <CurrentTime />
      </div>
    </div>
  );
};
