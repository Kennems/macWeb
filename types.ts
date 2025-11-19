
export enum AppID {
  FINDER = 'finder',
  GEMINI = 'gemini',
  CALCULATOR = 'calculator',
  VSCODE = 'vscode',
  SAFARI = 'safari',
  SETTINGS = 'settings',
  PHOTOS = 'photos',
  TERMINAL = 'terminal',
  NOTES = 'notes',
  TYPORA = 'typora',
  ABOUT_MAC = 'about_mac'
}

export interface WindowState {
  id: string;
  appId: AppID;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  fileId?: string; // Optional file ID associated with this window
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: React.ReactNode;
  defaultWidth: number;
  defaultHeight: number;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// File System Types
export type FileType = 'file' | 'folder';

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  content?: string;
  children?: string[]; // IDs of children
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
  position?: { x: number, y: number }; // For Desktop Icons
}

export interface FileSystemContextType {
  fs: Record<string, FileSystemItem>;
  createItem: (name: string, type: FileType, parentId: string, content?: string) => string;
  deleteItem: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  updateItemPosition: (id: string, x: number, y: number) => void;
  getItem: (id: string) => FileSystemItem | undefined;
  getChildren: (parentId: string) => FileSystemItem[];
  getPath: (id: string) => FileSystemItem[];
}

// System Types
export type SystemState = 'BOOTING' | 'LOGIN' | 'DESKTOP';

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  label: string;
  action: () => void;
  separator?: boolean;
  danger?: boolean;
}
