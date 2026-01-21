import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import CreateRoomPage from './pages/CreateRoomPage/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage/JoinRoomPage';
import EditorPage from './pages/EditorPage/EditorPage';
import RoomsPage from './pages/RoomsPage/RoomsPage';
import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import DocumentationPage from './pages/DocumentationPage';
import FeaturesPage from './pages/FeaturesPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Toaster - Header के ठीक नीचे (70px = header + 6px gap) */}
            <Toaster 
              position="top-center"
              reverseOrder={false}
              gutter={8}
              containerStyle={{
                top: '70px', // Header height (64px) + 6px gap
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              toastOptions={{
                className: '',
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  minWidth: '300px',
                  maxWidth: '90vw',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                },
                success: {
                  duration: 2500,
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#10B981',
                  },
                  style: {
                    background: '#10B981',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                },
                error: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#fff',
                    secondary: '#EF4444',
                  },
                  style: {
                    background: '#EF4444',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                },
                loading: {
                  duration: Infinity,
                  style: {
                    background: '#3B82F6',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                },
              }}
            />
            
            <Header />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/create" element={<CreateRoomPage />} />
                <Route path="/join" element={<JoinRoomPage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/editor/:roomId" element={<EditorPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
                <Route path="/features" element={<FeaturesPage />} />
              </Routes>
            </main>
            
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;