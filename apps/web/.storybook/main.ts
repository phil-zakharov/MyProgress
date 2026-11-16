import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  "features": {
    "componentsManifest": true,
  },
  // Vite не применяет sassOptions из next.config.ts — инжектим переменные сами
  viteFinal: async (viteConfig) => {
    viteConfig.css = {
      ...viteConfig.css,
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${path.resolve(import.meta.dirname, '../src/styles/variables.module.scss')}" as *;`,
        },
      },
    };
    return viteConfig;
  },
};
export default config;



