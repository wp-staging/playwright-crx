/**
 * Copyright (c) Rui Figueira.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [{
    name: 'copy playwright-crx',
    closeBundle: () => {
      fs.mkdirSync(path.resolve(__dirname, 'dist/playwright-crx'), { recursive: true });
      fs.copyFileSync(path.resolve(__dirname, '../../lib/test.mjs'), path.resolve(__dirname, 'dist/playwright-crx/test.mjs'));
      fs.copyFileSync(path.resolve(__dirname, '../../lib/test.mjs.map'), path.resolve(__dirname, 'dist/playwright-crx/test.mjs.map'));
    },
    transform: (code) => {
      return code.replace('playwright-crx/test', './playwright-crx/test.mjs');
    },
  }],
  build: {
    // code cannot be obfuscated
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        'background': path.resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
      external: ['./playwright-crx/test.mjs'],
    },
  },
});
