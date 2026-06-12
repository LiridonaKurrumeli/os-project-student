import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface WeatherData {
  temperature: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Tirana");

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setTimeout(() => {
      const conditions = [
        "Sunny",
        "Cloudy",
        "Rainy",
        "Partly Cloudy",
        "Stormy",
      ];
      const icons = ["☀️", "⛅", "🌧️", "🌤️", "⛈️"];
      const randomIndex = Math.floor(Math.random() * conditions.length);

      const mockWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 30) + 5,
        condition: conditions[randomIndex],
        location: city,
        humidity: Math.floor(Math.random() * 60) + 30,
        windSpeed: Math.floor(Math.random() * 25) + 5,
        icon: icons[randomIndex],
      };
      setWeather(mockWeather);
      setLoading(false);
      toast.success(`Weather updated for ${city}`);
    }, 800);
  };

  useEffect(() => {
    fetchWeather("Tirana");
  }, []);

  return (
    <div className="flex flex-col flex-1 max-h-full overflow-y-auto bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-800">
      <div className="max-w-md mx-auto w-full p-6">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-4 text-center">Weather</h1>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && fetchWeather(location)}
              placeholder="Enter city name..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={() => fetchWeather(location)}
              className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              🔍
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4">Loading weather...</p>
            </div>
          ) : (
            weather && (
              <div className="text-center">
                <div className="text-7xl mb-4">{weather.icon}</div>
                <div className="text-5xl font-bold mb-2">
                  {weather.temperature}°C
                </div>
                <div className="text-xl mb-4">{weather.condition}</div>
                <div className="text-lg mb-2">📍 {weather.location}</div>
                <div className="flex justify-center gap-8 mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl mb-1">💧</div>
                    <div className="text-sm">{weather.humidity}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">💨</div>
                    <div className="text-sm">{weather.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <p className="text-center text-white/60 text-xs mt-4">
          ℹ️ Weather data is simulated for demonstration
        </p>
      </div>
    </div>
  );
};
