import { useEffect, useRef, useState } from 'react';
import { ShoppingList } from '../types/list';
import { auth } from '../config/firebase';

interface NotificationState {
  show: boolean;
  message: string;
  listName?: string;
  listId?: string;
}

/**
 * Hook to detect when lists are shared with the current user
 * and show notifications (browser + in-app)
 */
export const useNotifications = (lists: ShoppingList[]) => {
  const [inAppNotification, setInAppNotification] = useState<NotificationState>({
    show: false,
    message: ''
  });
  const previousListsRef = useRef<Set<string>>(new Set());
  const notificationPermissionRef = useRef<NotificationPermission>('default');

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        notificationPermissionRef.current = permission;
      });
    } else if ('Notification' in window) {
      notificationPermissionRef.current = Notification.permission;
    }
  }, []);

  // Detect newly shared lists
  useEffect(() => {
    if (!auth.currentUser || lists.length === 0) {
      // Initialize previous lists when user logs in
      if (auth.currentUser) {
        const currentListIds = new Set(lists.map(l => l.id));
        previousListsRef.current = currentListIds;
      }
      return;
    }

    const currentUserEmail = auth.currentUser.email?.toLowerCase() || '';
    if (!currentUserEmail) return;

    const currentListIds = new Set(lists.map(l => l.id));
    const previousListIds = previousListsRef.current;

    // Find newly shared lists (lists that are shared with user but not owned by user)
    const newSharedLists = lists.filter(list => {
      // Skip if we've seen this list before
      if (previousListIds.has(list.id)) return false;
      
      // Only notify for lists shared with user (not owned by user)
      const isOwned = list.ownerId === auth.currentUser?.uid;
      if (isOwned) return false;

      const sharedWith = (list.sharedWith || []).map((email: string) => email.toLowerCase());
      return sharedWith.includes(currentUserEmail);
    });

    // Show notifications for newly shared lists
    if (newSharedLists.length > 0) {
      newSharedLists.forEach(list => {
        const message = `"${list.name}" has been shared with you`;
        
        // Show browser notification if permission granted
        if (notificationPermissionRef.current === 'granted' && 'Notification' in window) {
          try {
            const notificationOptions: NotificationOptions = {
              body: message,
              tag: `list-shared-${list.id}`,
              requireInteraction: false
            };
            
            // Add icon if available (PWA icons)
            // Icon path will be set when PWA icons are added
            new Notification('New List Shared', notificationOptions);
          } catch (error) {
            console.error('Error showing browser notification:', error);
          }
        }

        // Show in-app notification as fallback or in addition
        setInAppNotification({
          show: true,
          message,
          listName: list.name,
          listId: list.id
        });

        // Auto-hide in-app notification after 5 seconds
        setTimeout(() => {
          setInAppNotification(prev => 
            prev.listId === list.id ? { show: false, message: '' } : prev
          );
        }, 5000);
      });
    }

    // Update previous lists
    previousListsRef.current = currentListIds;
  }, [lists]);

  const dismissNotification = () => {
    setInAppNotification({ show: false, message: '' });
  };

  return {
    inAppNotification,
    dismissNotification,
    hasPermission: notificationPermissionRef.current === 'granted'
  };
};

