# KOL Analytics Dashboard - Frontend

A modern, responsive React dashboard for analyzing Key Opinion Leaders (KOLs) in the medical/pharmaceutical space.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Context API** - State management
- **Vite** - Build tool

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at: **http://localhost:8080**

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── types/          # TypeScript interfaces
│   ├── services/       # API service layer
│   ├── context/        # Context API for state management
│   ├── components/     # Reusable React components
│   │   ├── ui/         # Base UI components
│   │   ├── dashboard/  # Dashboard-specific components
│   │   └── layout/     # Layout components (Header, Sidebar)
│   ├── pages/          # Page components (routes)
│   ├── lib/            # Utility functions
│   └── App.tsx         # Main application component
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Features

### Pages
1. **Dashboard** - Overview with KPIs, charts, and top KOLs
2. **KOL Explorer** - Searchable, filterable table with pagination
3. **Analytics** - Scatter plot analysis with insights
4. **Insights** - AI-powered recommendations
5. **Settings** - Profile management and data export

### Core Features
- Real-time data from FastAPI backend
- Interactive visualizations (bar charts, pie charts, scatter plots)
- Advanced filtering (search, dropdowns, range sliders)
- Smart pagination (20 per page, auto-disables with filters)
- Sortable tables
- Download functionality (CSV, JSON)
- Responsive design (mobile-friendly)
- Error handling with graceful fallbacks
- Loading states

## API Integration

The frontend connects to a FastAPI backend at `http://localhost:8000`

### Environment Variables

Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

### API Endpoints Used

- `GET /api/kols` - List all KOLs
- `GET /api/kols/{id}` - Single KOL details
- `GET /api/kols/stats` - Aggregate statistics
- `GET /api/kols/meta/countries` - Country filter options
- `GET /api/kols/meta/expertise-areas` - Expertise filter options
- `GET /health` - Backend health check

## State Management

Uses React Context API with custom hooks:

```typescript
// In any component
import { useKOL } from '@/context/KOLContext';

const { kols, stats, loading, isAPIAvailable } = useKOL();
```

## TypeScript

Strict TypeScript configuration:
- No `any` types allowed
- Strict null checks
- All interfaces defined in `src/types/`

## Styling

TailwindCSS with custom design system:
- Consistent color palette
- Responsive breakpoints
- Dark mode support (via CSS variables)
- Custom animations

## Development

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Code Quality

- ESLint configured for React + TypeScript
- Strict TypeScript compiler settings
- Component modularity
- Proper error boundaries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Code splitting via React lazy loading
- Optimized re-renders with `useMemo` and `useCallback`
- Efficient state updates
- Fast build times with Vite

## Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to backend
1. Verify backend is running at http://localhost:8000
2. Check CORS configuration in backend
3. Verify API_BASE_URL in `.env`

### Build fails
```bash
# Clear cache
rm -rf node_modules/.vite
npm run build
```

## Contributing

This is a technical test project. For production use, consider:
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright/Cypress)
- Performance monitoring
- Error tracking (Sentry)
- Analytics

## License

MIT

---

**Built for the KOL Analytics Technical Test**
