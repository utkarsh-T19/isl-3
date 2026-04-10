import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Automatically extract the repository name when running in GitHub Actions.
  // E.g. 'utkarsh/isl-app' becomes '/isl-app/' to fix missing assets.
  base: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/',
})
