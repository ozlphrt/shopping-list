import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/context';
import { ShoppingList } from '../types/list';
import { auth } from '../config/firebase';
import { useHiddenLists } from '../hooks/useHiddenLists';
import './ListDropdown.css';

interface ListDropdownProps {
  lists: ShoppingList[];
  currentListId: string | null;
  onSelectList: (listId: string) => void;
  onDeleteList?: (listId: string) => void;
  loading?: boolean;
}

export const ListDropdown = ({ 
  lists, 
  currentListId, 
  onSelectList,
  onDeleteList,
  loading = false 
}: ListDropdownProps) => {
  const { t } = useI18n();
  const { hiddenListIds, hideList } = useHiddenLists();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  // Filter lists to only show ones the user owns or is shared on
  // Also filter out hidden lists
  const filteredLists = lists.filter(list => {
    if (!currentUser) return false;
    
    // Don't show hidden lists
    if (hiddenListIds.includes(list.id)) return false;
    
    const normalizedUserEmail = currentUser.email?.toLowerCase() || '';
    const normalizedSharedWith = (list.sharedWith || []).map((email: string) => email.toLowerCase());
    
    const isOwned = list.ownerId === currentUser.uid;
    const isShared = normalizedUserEmail && normalizedSharedWith.includes(normalizedUserEmail);
    
    return isOwned || isShared;
  });

  const ownedLists = filteredLists.filter(list => list.ownerId === currentUser?.uid);
  const normalizedUserEmail = currentUser?.email?.toLowerCase() || '';
  const sharedLists = filteredLists.filter(list => {
    if (list.ownerId === currentUser?.uid) return false;
    if (!normalizedUserEmail) return false;
    const normalizedSharedWith = (list.sharedWith || []).map((email: string) => email.toLowerCase());
    return normalizedSharedWith.includes(normalizedUserEmail);
  });

  // Adjust dropdown position to prevent overflow
  useEffect(() => {
    if (!menuRef.current || !dropdownRef.current) return;

    // Use setTimeout to ensure DOM has fully rendered
    const timeoutId = setTimeout(() => {
      if (!menuRef.current || !dropdownRef.current) return;

      const menu = menuRef.current;
      const dropdown = dropdownRef.current;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 16; // 1rem padding from screen edges

      // Reset positioning
      menu.style.left = '';
      menu.style.right = '';
      menu.style.top = '';
      menu.style.bottom = '';
      menu.style.maxWidth = '';
      menu.style.maxHeight = '';
      menu.style.width = '';

      // Get dropdown button position
      const dropdownRect = dropdown.getBoundingClientRect();
      
      // Force a reflow to get accurate menu dimensions
      menu.offsetHeight;
      
      // Get menu dimensions
      const menuRect = menu.getBoundingClientRect();
      const menuWidth = menuRect.width || 280;
      const menuHeight = menuRect.height || 200;

      // Determine horizontal positioning using fixed positioning (viewport coordinates)
      // Center the dropdown relative to the button, with preference for centering
      let leftPos: number;
      let maxWidth: number;
      
      const buttonCenter = dropdownRect.left + (dropdownRect.width / 2);
      const idealLeftPos = buttonCenter - (menuWidth / 2);
      
      // Calculate available space for centered position
      const spaceOnRightForCenter = viewportWidth - idealLeftPos;
      const spaceOnLeftForCenter = idealLeftPos;
      
      // Calculate available space for edge alignment
      const spaceOnRight = viewportWidth - dropdownRect.left;
      const spaceOnLeft = dropdownRect.left;
      
      if (idealLeftPos >= padding && (idealLeftPos + menuWidth) <= (viewportWidth - padding)) {
        // Centered position fits perfectly
        leftPos = idealLeftPos;
        maxWidth = Math.min(400, Math.min(spaceOnRightForCenter, spaceOnLeftForCenter) * 2 - padding);
      } else if (spaceOnRight >= menuWidth + padding) {
        // Enough space on right, align to left edge of button
        leftPos = dropdownRect.left;
        maxWidth = Math.min(400, spaceOnRight - padding);
      } else if (spaceOnLeft >= menuWidth + padding) {
        // Not enough space on right, but enough on left - align to right edge of button
        leftPos = dropdownRect.right - menuWidth;
        maxWidth = Math.min(400, spaceOnLeft - padding);
      } else {
        // Not enough space on either side - constrain width and center as much as possible
        maxWidth = Math.max(spaceOnRight, spaceOnLeft) - padding;
        const centeredPos = buttonCenter - (maxWidth / 2);
        leftPos = Math.max(padding, Math.min(centeredPos, viewportWidth - maxWidth - padding));
      }
      
      // Ensure leftPos is within bounds
      leftPos = Math.max(padding, Math.min(leftPos, viewportWidth - maxWidth - padding));
      menu.style.left = `${leftPos}px`;
      menu.style.maxWidth = `${Math.max(maxWidth, 200)}px`;

      // Calculate vertical position (using viewport coordinates)
      const spaceBelow = viewportHeight - dropdownRect.bottom;
      const spaceAbove = dropdownRect.top;
      
      let topPos: number;
      let maxHeight: number;
      
      if (spaceBelow >= menuHeight + padding) {
        // Enough space below
        topPos = dropdownRect.bottom + 8; // 0.5rem = 8px
        maxHeight = Math.min(400, spaceBelow - padding);
      } else if (spaceAbove >= menuHeight + padding) {
        // Not enough space below, but enough above
        topPos = dropdownRect.top - menuHeight - 8;
        maxHeight = Math.min(400, spaceAbove - padding);
      } else {
        // Constrain height to fit available space
        maxHeight = Math.max(spaceBelow, spaceAbove) - padding;
        if (spaceBelow >= spaceAbove) {
          topPos = dropdownRect.bottom + 8;
        } else {
          topPos = dropdownRect.top - maxHeight - 8;
        }
      }
      
      // Ensure topPos is within bounds
      topPos = Math.max(padding, Math.min(topPos, viewportHeight - maxHeight - padding));
      menu.style.top = `${topPos}px`;
      menu.style.maxHeight = `${Math.max(maxHeight, 150)}px`;
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [lists.length]);

  const handleSelectList = (listId: string) => {
    onSelectList(listId);
  };

  const handleDeleteList = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    // Only allow deletion if user is the owner
    if (list.ownerId !== currentUser?.uid) {
      alert('Only the list owner can delete this list.');
      return;
    }

    // Call the delete handler (which will show the modal)
    if (onDeleteList) {
      onDeleteList(listId);
    }
  };

  const handleHideList = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    const list = lists.find(l => l.id === listId);
    if (!list || !currentUser) return;

    // Only allow hiding shared lists (not owned lists)
    if (list.ownerId === currentUser.uid) {
      return; // Can't hide owned lists
    }

    try {
      await hideList(listId);
      // If the hidden list was currently selected, select first available list or null
      if (currentListId === listId) {
        // Find first available list (owned or shared, not hidden)
        const availableList = filteredLists.find(l => l.id !== listId);
        if (availableList) {
          onSelectList(availableList.id);
        } else {
          // No other lists available, will be handled by App.tsx auto-selection
          onSelectList('');
        }
      }
    } catch (error: any) {
      console.error('Error hiding list:', error);
      alert(t('list.hideError') || 'Failed to remove list from view');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="list-dropdown" ref={dropdownRef}>
      <div className="list-dropdown-menu" ref={menuRef}>
          {filteredLists.length === 0 ? (
            <div className="list-dropdown-empty">
              <p>{t('list.noLists') || 'No lists yet'}</p>
            </div>
          ) : (
            <>
              {ownedLists.length > 0 && (
                <div className="list-dropdown-section">
                  <div className="list-dropdown-section-title">
                    {t('list.myLists') || 'My Lists'}
                  </div>
                  {ownedLists.map(list => (
                    <div
                      key={list.id}
                      className={`list-dropdown-item-wrapper ${currentListId === list.id ? 'list-dropdown-item-active' : ''}`}
                    >
                      <button
                        onClick={() => handleSelectList(list.id)}
                        className="list-dropdown-item"
                      >
                        <span className="list-dropdown-item-name">{list.name}</span>
                        <span className="list-dropdown-item-badge list-dropdown-item-badge-owned">
                          {t('list.owner') || 'Owner'}
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleDeleteList(e, list.id)}
                        className="list-dropdown-item-delete"
                        title={t('form.delete') || 'Delete list'}
                        aria-label={t('form.delete') || 'Delete list'}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {sharedLists.length > 0 && (
                <div className="list-dropdown-section">
                  <div className="list-dropdown-section-title">
                    {t('list.sharedLists') || 'Shared With Me'}
                  </div>
                  {sharedLists.map(list => (
                    <div
                      key={list.id}
                      className={`list-dropdown-item-wrapper ${currentListId === list.id ? 'list-dropdown-item-active' : ''}`}
                    >
                      <button
                        onClick={() => handleSelectList(list.id)}
                        className="list-dropdown-item"
                      >
                        <span className="list-dropdown-item-name">{list.name}</span>
                        <span className="list-dropdown-item-badge list-dropdown-item-badge-shared">
                          {t('list.shared') || 'Shared'}
                        </span>
                      </button>
                      <button
                        onClick={(e) => handleHideList(e, list.id)}
                        className="list-dropdown-item-remove"
                        title={t('list.removeFromView') || 'Remove from my lists'}
                        aria-label={t('list.removeFromView') || 'Remove from my lists'}
                      >
                        <span className="material-symbols-outlined">visibility_off</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
};

