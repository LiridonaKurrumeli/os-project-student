import { PowerButton } from "@components/PowerButton/PowerButton";
import { useAuthContext } from "@context/AuthContext/AuthContext";
import { ThemeProvider } from "@context/ThemeContext/ThemeContext";
import { Login } from "@pages/Login/Login";
import { MainScreen } from "@pages/MainScreen/MainScreen";

function App() {
  const { isAuthenticated } = useAuthContext();

  return (
    <ThemeProvider>
      <div className="w-full h-screen bg-gradient-to-b from-primary to-secondary dark:from-gray-800 dark:to-gray-900">
        {!isAuthenticated ? <Login /> : <MainScreen />}
        <PowerButton />
      </div>
    </ThemeProvider>
  );
}

export default App;
