import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { generateBiographyChapter } from '../services/geminiService';
import { Book, RefreshCw, Sparkles } from 'lucide-react';

export const StoryView: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
  const [biography, setBiography] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchBio = async () => {
    if (entries.length === 0) {
      setBiography("Please add some journal entries first so the AI has material to work with.");
      return;
    }
    
    setLoading(true);
    const text = await generateBiographyChapter(entries);
    setBiography(text);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#fdfbf7] min-h-[80vh] shadow-2xl border border-museum-200 p-8 md:p-16 relative">
      {/* Book Binding Visuals */}
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-museum-800 to-museum-600"></div>
      <div className="absolute left-2 top-0 bottom-0 w-1 bg-museum-300 opacity-20"></div>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-museum-900 mb-2">The Life Story</h2>
        <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-museum-400 animate-pulse">
          <Book size={48} />
          <p className="font-serif">The biographer is writing your chapter...</p>
        </div>
      ) : biography ? (
        <article className="prose prose-lg prose-stone mx-auto font-serif leading-loose">
           <div className="whitespace-pre-wrap first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
             {biography}
           </div>
        </article>
      ) : (
        <div className="text-center py-20">
            <div className="w-16 h-16 bg-museum-100 rounded-full flex items-center justify-center mx-auto mb-6 text-museum-400">
                <Book size={32} />
            </div>
            <p className="text-museum-500 mb-8 italic max-w-md mx-auto">
              {entries.length > 0 
                ? "Your memories are ready to be woven into a story. Click below to begin." 
                : "The pages are blank. Add some entries to the timeline to start your biography."}
            </p>
            
            {entries.length > 0 && (
              <button 
                  onClick={fetchBio}
                  className="bg-museum-800 text-museum-50 px-8 py-3 rounded-full hover:bg-black transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto font-medium"
              >
                  <Sparkles size={18} className="text-amber-400" />
                  Generate Biography
              </button>
            )}
        </div>
      )}

      {biography && !loading && (
        <div className="mt-16 pt-8 border-t border-museum-100 text-center">
          <button 
            onClick={fetchBio}
            disabled={loading}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-museum-400 hover:text-amber-600 transition-colors px-4 py-2 rounded-full hover:bg-museum-100"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Regenerate Chapter
          </button>
        </div>
      )}
    </div>
  );
};