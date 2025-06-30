# Album Viewer

A simple Vue.js application that displays albums from the albums API.

## Features

- 🎵 Display album collection in a beautiful grid layout
- 🎨 Modern, responsive design with gradient background
- 🖼️ Album cover images with hover effects
- 💰 Price display for each album
- 📱 Mobile-friendly responsive design
- ⚡ Built with Vue 3 and Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The albums-api should be running on `http://localhost:5000`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Integration

The app fetches album data from the albums API endpoint `/albums`. Make sure the albums-api is running before starting the Vue app.

The API should return albums in the following format:
```json
[
  {
    "id": 1,
    "title": "Album Title",
    "artist": "Artist Name",
    "price": 10.99,
    "image_url": "https://example.com/image.jpg"
  }
]
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
album-viewer/
├── src/
│   ├── components/
│   │   └── AlbumCard.vue    # Individual album card component
│   ├── App.vue              # Main app component
│   └── main.js              # App entry point
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## Technologies Used

- Vue 3 (Composition API)
- Vite (Build tool)
- Axios (HTTP client)
- CSS3 (Grid, Flexbox, Animations)

## Features in Detail

### Album Cards
Each album is displayed in a card with:
- Album cover image
- Title and artist information
- Price display
- Hover effects with play button overlay
- Add to Cart and Preview buttons

### Responsive Design
The app adapts to different screen sizes:
- Desktop: Multi-column grid layout
- Mobile: Single column layout with stacked buttons

### Error Handling
- Loading spinner while fetching data
- Error message with retry button if API is unavailable
- Fallback placeholder image for broken album covers
