import React, { useEffect, useRef } from 'react';
import { ContextMenuItem } from '../../types';

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-48 bg-[#F6F6F6]/90 backdrop-blur-xl border border-gray-300/50 rounded-lg shadow-xl py-1.5 select-none animate-in fade-in zoom-in-95 duration-100"
      style={{ top: y, left: x }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.separator ? (
            <div className="h-[1px] bg-gray-300/50 my-1 mx-2" />
          ) : (
            <div
              onClick={() => {
                item.action();
                onClose();
              }}
              className={`px-3 py-1 mx-1 rounded hover:bg-blue-500 hover:text-white text-sm cursor-default flex items-center ${
                item.danger ? 'text-red-500' : 'text-gray-800'
              }`}
            >
              {item.label}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu;