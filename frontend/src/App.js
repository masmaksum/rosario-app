import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { ProgressProvider } from "./context/ProgressContext";
import HomePage from "./pages/HomePage";
import SelectMysteryPage from "./pages/SelectMysteryPage";
import PrayPage from "./pages/PrayPage";
import SettingsPage from "./pages/SettingsPage";
import IntentionsPage from "./pages/IntentionsPage";

function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <div className="App min-h-screen bg-background text-foreground">
          <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-background">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pilih-peristiwa" element={<SelectMysteryPage />} />
                <Route path="/doa/:mysteryId" element={<PrayPage />} />
                <Route path="/intensi" element={<IntentionsPage />} />
                <Route path="/pengaturan" element={<SettingsPage />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </ProgressProvider>
    </SettingsProvider>
  );
}

export default App;
