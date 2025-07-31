# Notes Frontend

A modern, responsive React/Next.js frontend application for managing personal notes with authentication and real-time features.

## Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Secure session management
- Auto-redirect based on authentication status

### 📝 Note Management
- Create, edit, and delete notes
- Real-time auto-save functionality
- Search and filter notes
- Rich text editing experience

### 🎨 User Interface
- Modern, minimalistic design
- Responsive layout (mobile-first)
- Dark/light theme toggle
- Sidebar navigation
- Clean note editor interface

### 📱 Responsive Design
- Desktop-optimized sidebar layout
- Mobile-friendly collapsible sidebar
- Touch-friendly interface elements
- Adaptive typography and spacing

## Tech Stack

- **Framework**: Next.js 15.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd notes_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build

Create a production build:
```bash
npm run build
```

### Lint

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (redirects)
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── Header.tsx         # App header with theme toggle
│   ├── Sidebar.tsx        # Notes navigation sidebar
│   └── NoteEditor.tsx     # Note editing interface
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state management
│   └── ThemeContext.tsx   # Theme state management
├── lib/                   # Utility libraries
│   └── api.ts            # API client for backend communication
└── types/                 # TypeScript type definitions
    └── api.ts            # API response and request types
```

## Key Components

### AuthContext
Manages user authentication state, login/logout functionality, and token persistence.

### ThemeContext
Handles dark/light theme switching with system preference detection and localStorage persistence.

### NoteEditor
Rich text editor with auto-save functionality, keyboard shortcuts, and real-time status indicators.

### Sidebar
Note list with search functionality, creation controls, and responsive mobile behavior.

## API Integration

The frontend integrates with the Notes API backend through:
- RESTful endpoints for CRUD operations
- JWT token authentication
- Error handling and user feedback
- Auto-retry mechanisms

### API Endpoints Used
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `GET /api/notes` - List notes with search/pagination
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Features in Detail

### Auto-Save
- Automatically saves changes after 2 seconds of inactivity
- Visual indicators for save status
- Manual save with Ctrl+S keyboard shortcut
- Error handling with user feedback

### Theme System
- Respects system preference on first visit
- Persists user choice in localStorage
- Smooth transitions between themes
- Consistent styling across all components

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile devices
- Touch-friendly interface elements
- Optimized layouts for different screen sizes

### Search & Filter
- Real-time search as you type
- Searches both title and content
- Debounced API calls for performance
- Clear search results display

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |
| `NEXT_PUBLIC_SITE_URL` | Frontend site URL | `http://localhost:3000` |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new code
3. Add proper error handling and loading states
4. Test responsive behavior on different screen sizes
5. Ensure accessibility standards are met

## License

This project is part of the Notes application suite.
