
import React, { useState, useEffect } from 'react';
import { Screen, User } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import RewardsScreen from './screens/RewardsScreen';
import SupportScreen from './screens/SupportScreen';
import BottomNav from './components/BottomNav';
import WelcomeScreen from './screens/WelcomeScreen';

const App: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('home');
    const [user, setUser] = useLocalStorage<User | null>('user', null);
    const [theme, setTheme] = useLocalStorage<'light'|'dark'>('theme', 'dark');

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    // Effect to handle dynamic viewport height on mobile browsers
    useEffect(() => {
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', setViewportHeight);
        setViewportHeight(); // Set initial value

        return () => window.removeEventListener('resize', setViewportHeight);
    }, []);
    
    const handleLogin = (userData: User) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user-stats');
        localStorage.removeItem('recent-trips');
        localStorage.removeItem('last-trip');
    }

    const renderScreen = () => {
        switch (activeScreen) {
            case 'home':
                return <HomeScreen setActiveScreen={setActiveScreen} user={user!} theme={theme} toggleTheme={toggleTheme} />;
            case 'profile':
                return <ProfileScreen setActiveScreen={setActiveScreen} user={user!} onUpdateUser={setUser} onLogout={handleLogout} />;
            case 'rewards':
                return <RewardsScreen />;
            case 'support':
                return <SupportScreen />;
            default:
                return <HomeScreen setActiveScreen={setActiveScreen} user={user!} theme={theme} toggleTheme={toggleTheme} />;
        }
    };
    
    if (!user) {
        return <WelcomeScreen onLogin={handleLogin} />;
    }
    
    return (
        // Layout fix: h-full with flex-col. Main takes remaining space and hides overflow.
        // Children screens are responsible for their own scrolling (h-full + overflow-y-auto).
        <div className="h-screen w-full font-sans bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-white transition-colors duration-500 flex flex-col overflow-hidden">
            <main className="flex-1 relative w-full overflow-hidden">
                {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        </div>
    );
};

export default App;
