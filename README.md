# Boxed React Word Puzzle

A React-based word puzzle game where players arrange letters to find pairs of words that use all available characters.

## Features

- Drag and drop interface for letter arrangement
- Efficient word searching using Trie data structure
- Real-time solution finding
- Touch-friendly interface
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vramdhanie/boxed-react.git
cd boxed-react
```

2. Install dependencies using pnpm:
```bash
pnpm install
```

## Development

Run the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
pnpm build
```

Preview the production build:
```bash
pnpm preview
```

## Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

### Manual Deployment

1. Update the `base` property in `vite.config.ts` with your repository name:
```ts
export default defineConfig({
  base: '/react-boxed/',
  // ... other config
});
```

2. Push your changes to the main branch:
```bash
git push origin main
```

3. The GitHub Action will automatically build and deploy your site to GitHub Pages.

4. Once deployed, your site will be available at `https://vramdhanie.github.io/react-boxed/`

### Setting up GitHub Pages

1. Go to your repository settings
2. Navigate to the "Pages" section
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Your site will be deployed automatically when you push to the main branch

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

