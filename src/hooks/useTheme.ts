import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { 
  colorPalettes, 
  applyColorPalette, 
  getStoredColorPalette, 
  getColorPaletteById,
  ColorPalette 
} from '../utils/colorPalettes';

export const useTheme = () => {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(
    getColorPaletteById(getStoredColorPalette())
  );
  const [loading, setLoading] = useState(true);

  // Load theme from Firestore on mount
  useEffect(() => {
    const loadTheme = async () => {
      if (!auth.currentUser) {
        // Use stored palette from localStorage if not signed in
        const storedId = getStoredColorPalette();
        const palette = getColorPaletteById(storedId);
        setCurrentPalette(palette);
        applyColorPalette(palette);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists() && userDoc.data().colorPalette) {
          const paletteId = userDoc.data().colorPalette;
          const palette = getColorPaletteById(paletteId);
          setCurrentPalette(palette);
          applyColorPalette(palette);
        } else {
          // Use stored palette from localStorage
          const storedId = getStoredColorPalette();
          const palette = getColorPaletteById(storedId);
          setCurrentPalette(palette);
          applyColorPalette(palette);
        }
      } catch (error: any) {
        // Silently fallback to localStorage if permissions are not set up yet
        if (error.code === 'permission-denied' || error.code === 'missing-or-insufficient-permissions') {
          // Firestore rules not deployed yet, use localStorage
          const storedId = getStoredColorPalette();
          const palette = getColorPaletteById(storedId);
          setCurrentPalette(palette);
          applyColorPalette(palette);
        } else {
          console.error('Error loading theme:', error);
          // Fallback to stored palette
          const storedId = getStoredColorPalette();
          const palette = getColorPaletteById(storedId);
          setCurrentPalette(palette);
          applyColorPalette(palette);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [auth.currentUser]);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().colorPalette) {
            const paletteId = userDoc.data().colorPalette;
            const palette = getColorPaletteById(paletteId);
            setCurrentPalette(palette);
            applyColorPalette(palette);
          }
        } catch (error: any) {
          // Silently fallback to localStorage if permissions are not set up yet
          if (error.code === 'permission-denied' || error.code === 'missing-or-insufficient-permissions') {
            // Firestore rules not deployed yet, use localStorage
            const storedId = getStoredColorPalette();
            const palette = getColorPaletteById(storedId);
            setCurrentPalette(palette);
            applyColorPalette(palette);
          } else {
            console.error('Error loading theme on auth change:', error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const setTheme = async (paletteId: string) => {
    const palette = getColorPaletteById(paletteId);
    setCurrentPalette(palette);
    applyColorPalette(palette);

    // Save to Firestore if user is signed in
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          email: auth.currentUser.email,
          colorPalette: paletteId,
          updatedAt: new Date(),
        }, { merge: true });
      } catch (error: any) {
        // Silently ignore permission errors - theme is already saved to localStorage
        if (error.code !== 'permission-denied' && error.code !== 'missing-or-insufficient-permissions') {
          console.error('Error saving theme:', error);
        }
      }
    }
  };

  return { currentPalette, setTheme, loading, palettes: colorPalettes };
};

