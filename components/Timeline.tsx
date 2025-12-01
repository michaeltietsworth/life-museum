import React, { useState } from 'react';
import { JournalEntry, Comment } from '../types';
import { addComment, deleteEntry } from '../services/firebaseService';
import { Trash2, MessageCircle } from 'lucide-react';

interface TimelineProps {
  userId: string;
  entries: JournalEntry[];
}

export const Timeline: React.FC<TimelineProps> = ({ userId, entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 opacity-50">
        <p className="font-serif text-xl italic">The museum is empty.</p>
        <p className="text-sm mt-2">Create your first entry above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-museum-200 -ml-[0.5px]"></div>
      
      {entries.map((entry, index) => (
        <TimelineCard key={entry.id} userId={userId} entry={entry} isEven={index % 2 === 0} />
      ))}
    </div>
  );
};

const TimelineCard: React.FC<{ userId: string; entry: JournalEntry; isEven: boolean }> = ({ userId, entry, isEven }) => {
  const [showComments, setShowComments] = useState(false);
  
  return (
    <div className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Date Marker */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-museum-50 border-4 border-museum-300 z-10 mt-6"></div>

      {/* Spacer for layout balance */}
      <div className="hidden md:block flex-1"></div>

      {/* Content Card */}
      <div className="flex-1 pl-12 md:pl-0">
        <div className={`bg-white p-6 rounded-lg shadow-sm border border-museum-200 relative group transition-all hover:shadow-md ${isEven ? 'md:mr-12' : 'md:ml-12'}`}>
          {/* Delete Button (visible on hover) */}
          <button 
            onClick={() => { if(confirm('Delete this memory?')) deleteEntry(userId, entry.id) }}
            className="absolute top-4 right-4 text-museum-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              {entry.category}
            </span>
            <span className="text-xs text-museum-400 font-mono">{entry.date}</span>
          </div>

          {entry.imageUrl && (
            <div className="mb-4 rounded-md overflow-hidden bg-museum-100">
              <img src={entry.imageUrl} alt="Memory" className="w-full h-auto object-cover max-h-[400px]" />
            </div>
          )}

          <p className="font-serif text-museum-800 leading-relaxed whitespace-pre-wrap">
            {entry.text}
          </p>

          <div className="mt-6 pt-4 border-t border-museum-100 flex items-center justify-between">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-xs font-medium text-museum-500 hover:text-museum-800 flex items-center gap-1"
            >
              <MessageCircle size={14} />
              {entry.comments?.length || 0} Guestbook Signatures
            </button>
          </div>

          {showComments && <Guestbook userId={userId} sectionId={entry.id} comments={entry.comments || []} />}
        </div>
      </div>
    </div>
  );
};

const Guestbook: React.FC<{ userId: string; sectionId: string, comments: Comment[] }> = ({ userId, sectionId, comments }) => {
  const [author, setAuthor] = useState('');
  const [relation, setRelation] = useState('');
  const [text, setText] = useState('');

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !text) return;
    await addComment(userId, sectionId, author, relation || 'Visitor', text);
    setAuthor('');
    setRelation('');
    setText('');
  };

  return (
    <div className="mt-4 bg-museum-50 rounded-lg p-4 border border-museum-100">
      <h4 className="text-xs font-bold uppercase text-museum-400 mb-3">Family & Friends Guestbook</h4>
      
      <div className="space-y-3 mb-4">
        {comments.map((c) => (
          <div key={c.id} className="text-sm border-l-2 border-amber-200 pl-3 py-1">
            <p className="text-museum-800">{c.text}</p>
            <p className="text-xs text-museum-500 mt-1">
              — <span className="font-semibold">{c.author}</span> ({c.relation})
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSign} className="grid grid-cols-2 gap-2">
        <input 
          placeholder="Your Name" 
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="col-span-1 bg-white border border-museum-200 p-2 text-xs rounded"
        />
        <input 
          placeholder="Relation (e.g. Son)" 
          value={relation}
          onChange={e => setRelation(e.target.value)}
          className="col-span-1 bg-white border border-museum-200 p-2 text-xs rounded"
        />
        <textarea 
          placeholder="Leave a note..." 
          value={text}
          onChange={e => setText(e.target.value)}
          className="col-span-2 bg-white border border-museum-200 p-2 text-xs rounded h-16 resize-none"
        />
        <button type="submit" className="col-span-2 bg-museum-800 text-white py-1 rounded text-xs hover:bg-black">Sign Guestbook</button>
      </form>
    </div>
  );
};