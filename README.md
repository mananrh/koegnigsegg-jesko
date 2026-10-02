# Koenigsegg Gemera — Interactive 3D Showcase

An interactive 3D web experience showcasing the **Koenigsegg Gemera Mega-GT**. Built with Three.js and Vite, featuring smooth scroll-driven camera movements, 3D model rendering, and performance breakdowns of Koenigsegg's four-seater hypercar.

![Tech Stack](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **Interactive 3D Canvas**: Real-time rendering of the Koenigsegg Gemera 3D model.
- **Scroll-Driven Storytelling**: Cinematic camera transitions synchronised with page scrolling.
- **Car Specs & Details**: Visual breakdowns of the 1,700 BHP hybrid powertrain (0-100 km/h in 1.9s) and luxury 4-seat interior.
- **Responsive Layout**: Fluid design tailored for high-refresh desktop monitors and mobile devices.

---

## 🚀 Tech Stack

- **[Three.js](https://threejs.org/)** — 3D scene setup, lighting, and GLTF/Draco loader pipeline.
- **[Vite](https://vitejs.dev/)** — Next-generation frontend tooling and bundler.
- **[Anime.js](https://animejs.com/)** — UI & micro-interaction animations.
- **Vanilla CSS** — Custom styling, typography, and glassmorphic layout.

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd koenigsegg-3d
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for production
```bash
npm run build
```
Production assets will be output to the `dist/` directory.

---

## 🌐 Deployment (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Framework Preset: **Vite** (Build: `npm run build`, Output: `dist`).
4. Click **Deploy**.
