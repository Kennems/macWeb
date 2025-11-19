
import React from 'react';
import { AppID, AppConfig } from './types';
import { 
  FinderIcon,
  SafariIcon,
  GeminiIcon,
  PhotosIcon,
  VSCodeIcon,
  TerminalIcon,
  NotesIcon,
  CalculatorIcon,
  SettingsIcon,
  TyporaIcon,
  CalendarIcon
} from './components/Icons';

export const WALLPAPER_URL = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=3270&auto=format&fit=crop";

export const APPS: Record<AppID, AppConfig> = {
  [AppID.FINDER]: {
    id: AppID.FINDER,
    title: 'Finder',
    icon: <FinderIcon />,
    defaultWidth: 800,
    defaultHeight: 500,
    color: 'bg-blue-500'
  },
  [AppID.SAFARI]: {
    id: AppID.SAFARI,
    title: 'Safari',
    icon: <SafariIcon />,
    defaultWidth: 1000,
    defaultHeight: 600,
    color: 'bg-white'
  },
  [AppID.GEMINI]: {
    id: AppID.GEMINI,
    title: 'Gemini AI',
    icon: <GeminiIcon />,
    defaultWidth: 500,
    defaultHeight: 700,
    color: 'bg-white'
  },
  [AppID.PHOTOS]: {
    id: AppID.PHOTOS,
    title: 'Photos',
    icon: <PhotosIcon />,
    defaultWidth: 800,
    defaultHeight: 600,
    color: 'bg-white'
  },
  [AppID.VSCODE]: {
    id: AppID.VSCODE,
    title: 'VS Code',
    icon: <VSCodeIcon />,
    defaultWidth: 900,
    defaultHeight: 600,
    color: 'bg-blue-600'
  },
  [AppID.TERMINAL]: {
    id: AppID.TERMINAL,
    title: 'Terminal',
    icon: <TerminalIcon />,
    defaultWidth: 600,
    defaultHeight: 400,
    color: 'bg-gray-900'
  },
  [AppID.TYPORA]: {
    id: AppID.TYPORA,
    title: 'Typora',
    icon: <TyporaIcon />,
    defaultWidth: 800,
    defaultHeight: 900,
    color: 'bg-white'
  },
  [AppID.NOTES]: {
    id: AppID.NOTES,
    title: 'Notes',
    icon: <NotesIcon />,
    defaultWidth: 800,
    defaultHeight: 500,
    color: 'bg-yellow-400'
  },
  [AppID.CALCULATOR]: {
    id: AppID.CALCULATOR,
    title: 'Calculator',
    icon: <CalculatorIcon />,
    defaultWidth: 320,
    defaultHeight: 450,
    color: 'bg-gray-700'
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    title: 'Settings',
    icon: <SettingsIcon />,
    defaultWidth: 700,
    defaultHeight: 500,
    color: 'bg-gray-400'
  },
  [AppID.ABOUT_MAC]: {
    id: AppID.ABOUT_MAC,
    title: 'About This Mac',
    icon: <SettingsIcon />, // Uses generic icon in dock/manager, but usually hidden from dock
    defaultWidth: 300,
    defaultHeight: 180,
    color: 'bg-gray-200'
  }
};
