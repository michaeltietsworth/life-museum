
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { EntryForm } from './components/EntryForm';
import { Timeline } from './components/Timeline';
import { StoryView } from './components/StoryView';
import { Auth } from './components/Auth';
import { subscribeToEntries, auth, signOut } from './services/firebaseService';
import { getDetectiveSuggestion } from './services/geminiService';
import { Category, JournalEntry, ViewMode } from './types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Search, AlertTriangle } from 'lucide-react';
import { FIREBASE_CONFIG } from './constants';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  
  const [currentCategory, setCurrentCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initialize Auth
  useEffect(() => {
    // Check if configuration is still using placeholders
    const isPlaceholder = FIREBASE_CONFIG.apiKey.includes("YOUR_FIREBASE") || 
                          FIREBASE_CONFIG.apiKey.includes("PASTE_YOUR");
    
    if (isPlaceholder) {
      setConfigError(true);
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Data (dependent on user)
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const unsubscribe = subscribeToEntries(user.uid, (data) => {
      setEntries(data);
    });

    return () => unsubscribe();
  }, [user]);

  // 3. Filter Logic (Category + Search)
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    
    const result = entries.filter(e => {
      const matchesCategory = currentCategory === 'All' || e.category === currentCategory;
      const matchesSearch = !query || 
        e.text.toLowerCase().includes(query) ||
        e.date.includes(query) ||
        e.category.toLowerCase().includes(query);
      
      return matchesCategory && matchesSearch;
    });

    setFilteredEntries(result);
  }, [currentCategory, entries, searchQuery]);

  // 4. AI Detective Logic (Trigger periodically or on entry change)
  useEffect(() => {
    if (entries.length > 0 && !aiSuggestion) {
      getDetectiveSuggestion(entries).then(setAiSuggestion);
    }
  }, [entries.length]); 

  const handleEntryAdded = () => {
    setAiSuggestion('');
    setViewMode('timeline');
    setSearchQuery('');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  // 5. Render Loading or Auth Screen
  if (configError) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-museum-50 text-museum-800 p-8">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <AlertTriangle size={32} />
            <h1 className="text-2xl font-serif font-bold">Configuration Required</h1>
          </div>
          <p className="mb-4 text-museum-600">
            The app is missing its Firebase connection keys. 
          </p>
          <div className="bg-museum-100 p-4 rounded text-sm font-mono overflow-x-auto mb-4">
            <p className="text-museum-500 mb-2">// Update constants.ts or set Environment Variables</p>
            <p>export const FIREBASE_CONFIG = {'{'}</p>
            <p className="pl-4">apiKey: "YOUR_KEY_HERE",</p>
            <p className="pl-4">...</p>
            <p>{'}'};</p>
          </div>
          <p className="text-sm text-museum-500">
            Please add your Firebase config keys to <code>src/constants.ts</code> to continue.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-museum-100 text-museum-600">
        <p className="animate-pulse">Opening the Museum doors...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  // 6. Render Main App
  return (
    <div className="flex flex-col md:flex-row h-screen bg-museum-50 overflow-hidden">
      <Sidebar 
        currentCategory={currentCategory} 
        onSelectCategory={setCurrentCategory}
        currentView={viewMode}
        onSelectView={setViewMode}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-8 md:py-12">
          
          {/* Header Area */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-serif text-museum-900">
                {viewMode === 'story' ? 'Biography' : (currentCategory === 'All' ? 'Complete Timeline' : `${currentCategory} Collection`)}
              </h2>
              <p className="text-museum-500 mt-2">
                {entries.length} memories curated
              </p>
            </div>

            {/* Search Bar */}
            {viewMode === 'timeline' && (
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memories..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-museum-200 rounded-full text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-museum-400" size={16} />
              </div>
            )}
          </div>

          {/* Main Content Area */}
          {viewMode === 'timeline' ? (
            <>
              {/* Only show entry form if not searching (cleaner UI) */}
              {!searchQuery && (
                <EntryForm 
                  userId={user.uid}
                  selectedCategory={currentCategory} 
                  suggestion={aiSuggestion}
                  onEntryAdded={handleEntryAdded}
                />
              )}

              {searchQuery && filteredEntries.length === 0 ? (
                <div className="text-center py-12 text-museum-400">
                  <p>No memories found matching "{searchQuery}"</p>
                </div>
              ) : (
                <Timeline userId={user.uid} entries={filteredEntries} />
              )}
            </>
          ) : (
            <StoryView entries={entries} />
          )}
          
        </div>
      </main>
    </div>
  );
}

export default App;
