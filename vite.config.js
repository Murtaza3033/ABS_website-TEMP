import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// React Compiler enabled via the Babel plugin (React 19 target).
// https://react.dev/learn/react-compiler/installation
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
})
