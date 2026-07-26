import { defineConfig } from 'vite';

export default defineConfig({
  // относительный base: работает и в подпапке /store/, и в корне домена
  base: './',

  build: {
    target: 'es2022',
    // чтобы бандл не смешивался с фото из public/assets/
    assetsDir: 'bundle',
  },
});
