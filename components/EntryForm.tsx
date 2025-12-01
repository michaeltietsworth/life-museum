import React, { useState, useRef } from 'react';
import { Category } from '../types';
import { addEntry } from '../services/firebaseService';
import { Camera, Send, X, Sparkles } from 'lucide-react';

interface EntryFormProps {
  userId: string;
  selectedCategory: Category | 'All';
  suggestion?: string;
  onEntryAdded: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ userId, selectedCategory, suggestion, onEntryAdded }) => {
  const [text, setText] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(selectedCategory === 'All' ? Category.GENERAL : selectedCategory);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await addEntry(userId, text, date, category, image || undefined, !!suggestion);
      setText('');
      setImage(null);
      // Reset date to today or keep user preference? Let's keep today.
      onEntryAdded();
    } catch (error) {
      alert("Failed to save entry. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-museum-200 overflow-hidden mb-8">
      {suggestion && (
        <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-start gap-3">
          <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs font-bold text-indigo-800 uppercase tracking-wide">AI Detective Prompt</p>
            <p className="text-sm text-indigo-900 font-medium italic">"{suggestion}"</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-4 md:p-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={suggestion ? "Answer the prompt..." : "What do you want to remember about this day?"}
          className="w-full min-h-[120px] p-3 text-lg font-serif text-museum-800 placeholder:text-museum-300 border-none focus:ring-0 resize-none outline-none"
        />

        {image && (
          <div className="relative inline-block mb-4 group">
            <img src={image} alt="Upload preview" className="h-32 w-auto rounded-lg border border-museum-200 object-cover" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-museum-100 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-museum-50 border border-museum-200 rounded-md px-3 py-1.5 text-sm text-museum-600 focus:outline-none focus:border-amber-500"
            />
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="bg-museum-50 border border-museum-200 rounded-md px-3 py-1.5 text-sm text-museum-600 focus:outline-none focus:border-amber-500"
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-museum-400 hover:text-museum-600 hover:bg-museum-100 rounded-full transition-colors"
              title="Add Photo"
            >
              <Camera size={20} />
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="flex items-center gap-2 bg-museum-800 text-museum-50 px-6 py-2 rounded-md font-medium text-sm hover:bg-museum-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
          >
            {isSubmitting ? 'Saving...' : 'Save to Museum'}
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};