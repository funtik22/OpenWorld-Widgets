import { defineConfig } from 'vite'
import { resolve } from 'path'

const root = resolve(__dirname, './src/pages')
const outDir = resolve(__dirname, 'dist')


export default defineConfig({
     root: root,
     build: {
            outDir: outDir,
            rollupOptions: {
                input: {
                    main: resolve(root, 'index.html'),
                    weather: resolve(root, 'weather/index.html'),
                }
            }
        }
    
})
    