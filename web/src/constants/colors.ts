// Color schemes for gradient themes
import type { ColorScheme, ColorTheme } from '../types/journey.types';

export const COLORS: Record<ColorTheme, ColorScheme> = {
    blue: { primary: '#667eea', secondary: '#764ba2', light: '#667eea20' },
    green: { primary: '#11998e', secondary: '#38ef7d', light: '#11998e20' },
    orange: { primary: '#f093fb', secondary: '#f5576c', light: '#f093fb20' },
    purple: { primary: '#4facfe', secondary: '#00f2fe', light: '#4facfe20' },
    sunset: { primary: '#fa709a', secondary: '#fee140', light: '#fa709a20' },
};

// Common colors
export const WHITE = '#fff';
export const GRAY_100 = '#f8f9fa';
export const GRAY_600 = '#666';
export const WHITE_80 = 'rgba(255,255,255,0.8)';
export const WHITE_90 = 'rgba(255,255,255,0.9)';
export const WHITE_20 = 'rgba(255,255,255,0.2)';
export const WHITE_30 = 'rgba(255,255,255,0.3)';
