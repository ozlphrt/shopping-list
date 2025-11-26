export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    cardBackground: string;
    cardBorder: string;
    cardHover: string;
    inputBackground: string;
    inputBorder: string;
    modalBackground: string;
    modalOverlay: string;
  };
}

export const colorPalettes: ColorPalette[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: 'rgba(34, 197, 94, 1)', // Green
      secondary: 'rgba(248, 113, 113, 1)', // Red
      accent: 'rgba(99, 102, 241, 1)', // Indigo
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)',
      surface: 'rgba(31, 41, 55, 0.95)',
      text: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.1)',
      inputBackground: 'rgba(0, 0, 0, 0.45)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackground: 'rgba(24, 34, 53, 0.95)',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: 'rgba(59, 130, 246, 1)', // Blue
      secondary: 'rgba(239, 68, 68, 1)', // Red
      accent: 'rgba(14, 165, 233, 1)', // Sky Blue
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)',
      surface: 'rgba(30, 58, 138, 0.95)',
      text: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.1)',
      inputBackground: 'rgba(0, 0, 0, 0.45)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackground: 'rgba(30, 58, 138, 0.95)',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    colors: {
      primary: 'rgba(168, 85, 247, 1)', // Purple
      secondary: 'rgba(236, 72, 153, 1)', // Pink
      accent: 'rgba(139, 92, 246, 1)', // Violet
      background: 'linear-gradient(135deg, #581c87 0%, #6b21a8 50%, #581c87 100%)',
      surface: 'rgba(88, 28, 135, 0.95)',
      text: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.1)',
      inputBackground: 'rgba(0, 0, 0, 0.45)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackground: 'rgba(88, 28, 135, 0.95)',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'orange',
    name: 'Sunset',
    colors: {
      primary: 'rgba(249, 115, 22, 1)', // Orange
      secondary: 'rgba(239, 68, 68, 1)', // Red
      accent: 'rgba(251, 146, 60, 1)', // Light Orange
      background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #7c2d12 100%)',
      surface: 'rgba(124, 45, 18, 0.95)',
      text: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.1)',
      inputBackground: 'rgba(0, 0, 0, 0.45)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackground: 'rgba(124, 45, 18, 0.95)',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'teal',
    name: 'Teal Wave',
    colors: {
      primary: 'rgba(20, 184, 166, 1)', // Teal
      secondary: 'rgba(34, 197, 94, 1)', // Green
      accent: 'rgba(6, 182, 212, 1)', // Cyan
      background: 'linear-gradient(135deg, #134e4a 0%, #155e75 50%, #134e4a 100%)',
      surface: 'rgba(19, 78, 74, 0.95)',
      text: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.1)',
      inputBackground: 'rgba(0, 0, 0, 0.45)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackground: 'rgba(19, 78, 74, 0.95)',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: 'rgba(156, 163, 175, 1)', // Gray
      secondary: 'rgba(239, 68, 68, 1)', // Red
      accent: 'rgba(107, 114, 128, 1)', // Slate
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      surface: 'rgba(15, 23, 42, 0.95)',
      text: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      cardHover: 'rgba(255, 255, 255, 0.1)',
      inputBackground: 'rgba(0, 0, 0, 0.45)',
      inputBorder: 'rgba(255, 255, 255, 0.08)',
      modalBackground: 'rgba(15, 23, 42, 0.95)',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      primary: 'rgba(34, 197, 94, 1)', // Green
      secondary: 'rgba(239, 68, 68, 1)', // Red
      accent: 'rgba(59, 130, 246, 1)', // Blue
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#0f172a',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(0, 0, 0, 0.15)',
      cardHover: 'rgba(0, 0, 0, 0.08)',
      inputBackground: 'rgba(255, 255, 255, 1)',
      inputBorder: 'rgba(0, 0, 0, 0.2)',
      modalBackground: 'rgba(255, 255, 255, 1)',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
    },
  },
  {
    id: 'light-blue',
    name: 'Light Blue',
    colors: {
      primary: 'rgba(59, 130, 246, 1)', // Blue
      secondary: 'rgba(239, 68, 68, 1)', // Red
      accent: 'rgba(14, 165, 233, 1)', // Sky Blue
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#1e40af',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(30, 64, 175, 0.25)',
      cardHover: 'rgba(30, 64, 175, 0.1)',
      inputBackground: 'rgba(255, 255, 255, 1)',
      inputBorder: 'rgba(30, 64, 175, 0.3)',
      modalBackground: 'rgba(255, 255, 255, 1)',
      modalOverlay: 'rgba(30, 64, 175, 0.4)',
    },
  },
  {
    id: 'light-purple',
    name: 'Light Purple',
    colors: {
      primary: 'rgba(168, 85, 247, 1)', // Purple
      secondary: 'rgba(236, 72, 153, 1)', // Pink
      accent: 'rgba(139, 92, 246, 1)', // Violet
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #faf5ff 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#6b21a8',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(107, 33, 168, 0.25)',
      cardHover: 'rgba(107, 33, 168, 0.1)',
      inputBackground: 'rgba(255, 255, 255, 1)',
      inputBorder: 'rgba(107, 33, 168, 0.3)',
      modalBackground: 'rgba(255, 255, 255, 1)',
      modalOverlay: 'rgba(107, 33, 168, 0.4)',
    },
  },
  {
    id: 'light-green',
    name: 'Light Green',
    colors: {
      primary: 'rgba(34, 197, 94, 1)', // Green
      secondary: 'rgba(239, 68, 68, 1)', // Red
      accent: 'rgba(20, 184, 166, 1)', // Teal
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#14532d',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(20, 83, 45, 0.25)',
      cardHover: 'rgba(20, 83, 45, 0.1)',
      inputBackground: 'rgba(255, 255, 255, 1)',
      inputBorder: 'rgba(20, 83, 45, 0.3)',
      modalBackground: 'rgba(255, 255, 255, 1)',
      modalOverlay: 'rgba(20, 83, 45, 0.4)',
    },
  },
];

export const applyColorPalette = (palette: ColorPalette) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', palette.colors.primary);
  root.style.setProperty('--color-secondary', palette.colors.secondary);
  root.style.setProperty('--color-accent', palette.colors.accent);
  root.style.setProperty('--color-background', palette.colors.background);
  root.style.setProperty('--color-surface', palette.colors.surface);
  root.style.setProperty('--color-text', palette.colors.text);
  root.style.setProperty('--color-card-background', palette.colors.cardBackground);
  root.style.setProperty('--color-card-border', palette.colors.cardBorder);
  root.style.setProperty('--color-card-hover', palette.colors.cardHover);
  root.style.setProperty('--color-input-background', palette.colors.inputBackground);
  root.style.setProperty('--color-input-border', palette.colors.inputBorder);
  root.style.setProperty('--color-modal-background', palette.colors.modalBackground);
  root.style.setProperty('--color-modal-overlay', palette.colors.modalOverlay);
  
  // Store in localStorage for persistence
  localStorage.setItem('colorPalette', palette.id);
};

export const getStoredColorPalette = (): string => {
  return localStorage.getItem('colorPalette') || 'default';
};

export const getColorPaletteById = (id: string): ColorPalette => {
  return colorPalettes.find(p => p.id === id) || colorPalettes[0];
};

