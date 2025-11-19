import React, { useState } from 'react';
import { Edit3, Trash2, Search } from 'lucide-react';

interface Note {
    id: number;
    title: string;
    content: string;
    date: string;
}

const Notes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([
        { id: 1, title: 'Grocery List', content: '- Milk\n- Eggs\n- Bread\n- Apples', date: 'Today' },
        { id: 2, title: 'Project Ideas', content: '1. macOS Web Sim\n2. AI Assistant Integration\n3. Cloud File Sync', date: 'Yesterday' },
        { id: 3, title: 'Meeting Notes', content: 'Discuss Q4 goals with the team. Focus on user retention.', date: 'Monday' }
    ]);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(1);
    const [search, setSearch] = useState('');

    const selectedNote = notes.find(n => n.id === selectedNoteId);

    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(search.toLowerCase()) || 
        n.content.toLowerCase().includes(search.toLowerCase())
    );

    const updateNote = (content: string) => {
        if (selectedNoteId === null) return;
        setNotes(notes.map(n => n.id === selectedNoteId ? { ...n, content, title: content.split('\n')[0] || 'New Note' } : n));
    };

    const createNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            date: 'Just Now'
        };
        setNotes([newNote, ...notes]);
        setSelectedNoteId(newNote.id);
    };

    const deleteNote = () => {
        if (selectedNoteId === null) return;
        const newNotes = notes.filter(n => n.id !== selectedNoteId);
        setNotes(newNotes);
        setSelectedNoteId(newNotes.length > 0 ? newNotes[0].id : null);
    };

    return (
        <div className="flex h-full w-full bg-white">
            {/* Sidebar */}
            <div className="w-64 bg-[#F5F5F5] border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200/50">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-gray-200/50 border border-gray-300/50 rounded-md py-1 pl-8 pr-3 text-sm focus:outline-none focus:bg-white transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredNotes.map(note => (
                        <div 
                            key={note.id}
                            onClick={() => setSelectedNoteId(note.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedNoteId === note.id ? 'bg-[#FFCC00] text-white shadow-sm' : 'hover:bg-gray-200/50 text-gray-800'}`}
                        >
                            <div className={`font-bold text-sm truncate ${selectedNoteId === note.id ? 'text-black' : ''}`}>{note.title || 'New Note'}</div>
                            <div className="flex gap-2 text-xs opacity-80 mt-1">
                                <span className={`${selectedNoteId === note.id ? 'text-black/70' : 'text-gray-500'}`}>{note.date}</span>
                                <span className={`truncate ${selectedNoteId === note.id ? 'text-black/60' : 'text-gray-400'}`}>{note.content.replace(note.title, '').trim().slice(0, 30)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col bg-white">
                <div className="h-12 border-b border-gray-100 flex items-center justify-end px-4 gap-4">
                    <button onClick={deleteNote} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={createNote} className="p-2 text-gray-400 hover:text-[#FFCC00] transition-colors" title="New Note">
                        <Edit3 size={20} />
                    </button>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    {selectedNote ? (
                        <>
                            <div className="text-xs text-gray-400 text-center mb-4">{selectedNote.date}</div>
                            <textarea 
                                className="w-full h-full resize-none outline-none text-lg leading-relaxed placeholder-gray-300"
                                value={selectedNote.content}
                                onChange={e => updateNote(e.target.value)}
                                placeholder="Type your note here..."
                            />
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-300">Select or create a note</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notes;
