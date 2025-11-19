
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemItem, FileType, FileSystemContextType } from '../types';

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

const STORAGE_KEY = 'macos_fs_data_v1';

const INITIAL_FS: Record<string, FileSystemItem> = {
  'root': { id: 'root', name: 'Macintosh HD', type: 'folder', children: ['desktop', 'documents', 'downloads'], parentId: null, createdAt: Date.now(), updatedAt: Date.now() },
  'desktop': { id: 'desktop', name: 'Desktop', type: 'folder', children: ['project_specs', 'welcome_txt', 'portfolio_folder'], parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  'documents': { id: 'documents', name: 'Documents', type: 'folder', children: ['notes_folder'], parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  'downloads': { id: 'downloads', name: 'Downloads', type: 'folder', children: [], parentId: 'root', createdAt: Date.now(), updatedAt: Date.now() },
  'notes_folder': { id: 'notes_folder', name: 'My Notes', type: 'folder', children: [], parentId: 'documents', createdAt: Date.now(), updatedAt: Date.now() },
  'project_specs': { id: 'project_specs', name: 'Project_Specs.md', type: 'file', content: '# Project Specifications\n\n- Build a macOS web sim\n- Make it awesome\n- Use React and Tailwind', parentId: 'desktop', createdAt: Date.now(), updatedAt: Date.now(), position: { x: 20, y: 20 } },
  'welcome_txt': { id: 'welcome_txt', name: 'Welcome.txt', type: 'file', content: 'Welcome to macOS Web Experience!\n\nExplore the system, open apps, and enjoy.', parentId: 'desktop', createdAt: Date.now(), updatedAt: Date.now(), position: { x: 20, y: 120 } },
  'portfolio_folder': { id: 'portfolio_folder', name: 'Portfolio', type: 'folder', children: [], parentId: 'desktop', createdAt: Date.now(), updatedAt: Date.now(), position: { x: 20, y: 220 } },
};

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage (The Backend) or fall back to Initial State
  const [fs, setFs] = useState<Record<string, FileSystemItem>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FS;
    } catch (e) {
      console.error("Failed to load FS from backend", e);
      return INITIAL_FS;
    }
  });

  // Persistence Effect: Save to LocalStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fs));
    } catch (e) {
      console.error("Failed to save FS to backend", e);
    }
  }, [fs]);

  const createItem = (name: string, type: FileType, parentId: string, content: string = '') => {
    const id = uuidv4();
    // Default position for new items on desktop
    const position = parentId === 'desktop' ? { x: 120, y: 20 } : undefined;
    
    const newItem: FileSystemItem = {
      id,
      name,
      type,
      content: type === 'file' ? content : undefined,
      children: type === 'folder' ? [] : undefined,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position
    };

    setFs(prev => {
      const parent = prev[parentId];
      if (!parent || parent.type !== 'folder') return prev;

      return {
        ...prev,
        [id]: newItem,
        [parentId]: {
          ...parent,
          children: [...(parent.children || []), id]
        }
      };
    });
    return id;
  };

  const deleteItem = (id: string) => {
    setFs(prev => {
      const item = prev[id];
      if (!item) return prev;
      
      const parentId = item.parentId;
      if (!parentId) return prev; // Can't delete root

      const parent = prev[parentId];
      const newParent = { ...parent, children: parent.children?.filter(childId => childId !== id) };

      const newFs = { ...prev };
      delete newFs[id];
      newFs[parentId] = newParent;
      return newFs;
    });
  };

  const updateFileContent = (id: string, content: string) => {
    setFs(prev => {
      if (!prev[id] || prev[id].type !== 'file') return prev;
      return {
        ...prev,
        [id]: { ...prev[id], content, updatedAt: Date.now() }
      };
    });
  };

  const updateItemPosition = (id: string, x: number, y: number) => {
      setFs(prev => {
          if (!prev[id]) return prev;
          return {
              ...prev,
              [id]: { ...prev[id], position: { x, y } }
          };
      });
  };

  const getItem = (id: string) => fs[id];

  const getChildren = (parentId: string) => {
    const parent = fs[parentId];
    if (!parent || !parent.children) return [];
    return parent.children.map(childId => fs[childId]).filter(Boolean);
  };

  const getPath = (id: string) => {
    const path: FileSystemItem[] = [];
    let current = fs[id];
    while (current) {
      path.unshift(current);
      if (!current.parentId) break;
      current = fs[current.parentId];
    }
    return path;
  };

  return (
    <FileSystemContext.Provider value={{ fs, createItem, deleteItem, updateFileContent, updateItemPosition, getItem, getChildren, getPath }}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error('useFileSystem must be used within a FileSystemProvider');
  return context;
};
