/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#2b8a5e';
const tintColorDark = '#2b8a5e';

export const Colors = {
  light: {
    primary: '#2b8a5e',
    secondary: '#f1b039',
    tertiary: '#999999',
    text: '#11181C',
    background: '#F5F7FA', // Soft off-white for premium feel
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    border: '#E2E8F0',
  },
  dark: {
    primary: '#2b8a5e',
    secondary: '#f1b039',
    tertiary: '#999999',
    text: '#ECEDEE',
    background: '#0F172A', // Deep slate for dark mode
    card: '#1E293B',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorDark,
    border: '#334155',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
