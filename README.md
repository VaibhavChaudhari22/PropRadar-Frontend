# PropRadar — Channel Partner Frontend

A clean, professional React frontend for the PropRadar real estate channel partner app.

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start dev server (ensure backend is running on port 3000)
npm run dev
```

The Vite dev server runs on **http://localhost:5173** and proxies `/api` → `http://localhost:3000`.

## 📁 Structure

```
src/
├── pages/
│   ├── ProjectsPage.jsx        # Listing with search + filters
│   ├── ProjectDetailPage.jsx   # Full project view
│   └── ProjectFormPage.jsx     # Add / Edit form
├── components/
│   ├── Sidebar.jsx             # Desktop navigation
│   ├── MobileNav.jsx           # Mobile bottom nav
│   ├── TopBar.jsx              # Page header
│   ├── ProjectCard.jsx         # Card for listing grid
│   └── FilterBar.jsx           # Search + filter controls
├── utils/
│   ├── api.js                  # Axios instance + API methods
│   └── helpers.js              # Formatters (price, area, etc.)
└── index.css                   # Design tokens + global styles
```

## 🔗 Routes

| Path | Page |
|------|------|
| `/` | Projects listing + filters |
| `/projects/new` | Add project form |
| `/projects/:id` | Project detail |
| `/projects/:id/edit` | Edit project form |

## 💡 Backend connection

Make sure your Express backend is on port 3000. The Vite proxy handles CORS automatically in dev. For production, update `vite.config.js` target or set `VITE_API_URL` env variable and update `src/utils/api.js`.

## 🎨 Design

- **Font**: Syne (headings) + DM Sans (body)
- **Colors**: Deep navy sidebar, warm cream backgrounds, gold accents
- **Responsive**: Sidebar on desktop → bottom tab bar on mobile
- **Filters**: Debounced search with location, BHK, and budget range filters
