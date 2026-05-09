import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";
import { ProgressProvider } from "./context/ProgressContext";
import { LanguageProvider } from "./context/LanguageContext";
import HomePage from "./pages/HomePage";
import SelectMysteryPage from "./pages/SelectMysteryPage";
import PrayPage from "./pages/PrayPage";
import SettingsPage from "./pages/SettingsPage";
import IntentionsPage from "./pages/IntentionsPage";
import RiwayatPage from "./pages/RiwayatPage";
import AdminAudioPage from "./pages/AdminAudioPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import LitaniListPage from "./pages/LitaniListPage";
import LitaniDetailPage from "./pages/LitaniDetailPage";
import NovenaPlaceholderPage from "./pages/NovenaPlaceholderPage";

function App() {
  return (
    <LanguageProvider>
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
                <Route path="/riwayat" element={<RiwayatPage />} />
                <Route path="/pengaturan" element={<SettingsPage />} />
                <Route path="/admin/audio" element={<AdminAudioPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/litani" element={<LitaniListPage />} />
                <Route path="/litani/:id" element={<LitaniDetailPage />} />
                <Route path="/novena" element={<NovenaPlaceholderPage />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </ProgressProvider>
    </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;
