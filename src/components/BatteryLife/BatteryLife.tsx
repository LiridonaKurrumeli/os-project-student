import { useState, useEffect } from "react";
import { Icon } from "@components/shared/Icon/Icon";

export const BatteryLife = () => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!("getBattery" in navigator)) {
      setIsSupported(false);
      return;
    }

    let batteryManager: any;

    const getBatteryStatus = async () => {
      try {
        const battery = await (navigator as any).getBattery();
        batteryManager = battery;

        const updateBatteryInfo = () => {
          setBatteryLevel(battery.level * 100);
          setIsCharging(battery.charging);
        };

        updateBatteryInfo();

        battery.addEventListener("levelchange", updateBatteryInfo);
        battery.addEventListener("chargingchange", updateBatteryInfo);
      } catch (error) {
        console.error("Battery API error:", error);
        setIsSupported(false);
      }
    };

    getBatteryStatus();

    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener("levelchange", () => {});
        batteryManager.removeEventListener("chargingchange", () => {});
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <div className="flex items-center mr-4 gap-x-1">
        <span className="text-xs font-bold cursor-pointer dark:text-white">
          N/A
        </span>
        <Icon icon="battery-life" className="w-[20px] dark:invert" />
      </div>
    );
  }

  if (batteryLevel === null) {
    return (
      <div className="flex items-center mr-4 gap-x-1">
        <span className="text-xs font-bold cursor-pointer dark:text-white">
          --
        </span>
        <Icon icon="battery-life" className="w-[20px] dark:invert" />
      </div>
    );
  }

  const getBatteryColor = () => {
    if (isCharging) return "text-green-500";
    if (batteryLevel > 75) return "text-green-600 dark:text-green-400";
    if (batteryLevel > 30) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBatteryIcon = () => {
    if (isCharging) return "⚡";
    if (batteryLevel > 75) return "🔋";
    if (batteryLevel > 30) return "🔋";
    return "🪫";
  };

  return (
    <div className={`flex items-center mr-4 gap-x-1 ${getBatteryColor()}`}>
      <span className="text-xs font-bold cursor-pointer">
        {getBatteryIcon()} {Math.round(batteryLevel)}%
      </span>
      <Icon icon="battery-life" className="w-[20px] dark:invert" />
    </div>
  );
};
