# Space Typer - 3D Typing Game

## Overview

Space Typer is a 3D space-themed typing game built with React Three Fiber and Express. Players defend their spaceship by typing words to destroy incoming enemy ships. The game features multiple difficulty levels, real-time 3D graphics, particle effects, and audio feedback. It combines fast-paced typing gameplay with immersive space visuals and sound effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main application framework
- **React Three Fiber** and **@react-three/drei** for 3D graphics and space environment rendering
- **@react-three/postprocessing** for visual effects and post-processing filters
- **Vite** as the build tool and development server with hot module replacement
- **Tailwind CSS** with **Radix UI** components for styling and UI elements
- **Zustand** for state management with separate stores for game logic, audio, and typing mechanics
- **TanStack Query** for server state management and API communication
- **Custom Canvas Game Engine** written in TypeScript for game mechanics, collision detection, and particle systems

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and static file serving
- **Memory-based storage** implementation for user data and game statistics
- **Session-based architecture** ready for future database integration
- **RESTful API structure** with `/api` prefix for all backend routes
- **Development/Production** environment handling with Vite middleware integration

### Database Design
- **Drizzle ORM** configured for PostgreSQL with schema definitions
- **User schema** with username/password authentication structure
- **Migration system** ready for database schema changes
- **Environment-based** database configuration using DATABASE_URL

### Game Engine Architecture
- **Canvas-based rendering** with 2D context for UI overlay and HUD elements
- **Physics simulation** for enemy movement, bullet trajectories, and particle effects
- **Word dictionary system** with difficulty-based word selection (easy/medium/hard)
- **Real-time performance tracking** for WPM (Words Per Minute) and accuracy calculations
- **Collision detection** between bullets and enemies
- **Particle system** for explosion effects and visual feedback
- **Star field background** with parallax scrolling effects

### Audio System
- **HTML5 Audio API** integration with background music and sound effects
- **Zustand store** for audio state management and mute functionality
- **Multiple audio channels** for overlapping sound effects (hit sounds, success sounds)
- **Volume control** and audio loading management

### State Management
- **Game State Store** managing game phases (menu, playing, paused, gameOver)
- **Audio State Store** handling sound effects and background music
- **Typing Game Store** tracking scores, WPM, accuracy, and high scores
- **Local Storage** integration for persistent high score tracking

## External Dependencies

### 3D Graphics and Effects
- **@react-three/fiber** - React renderer for Three.js 3D graphics
- **@react-three/drei** - Useful helpers and abstractions for React Three Fiber
- **@react-three/postprocessing** - Post-processing effects for enhanced visuals
- **vite-plugin-glsl** - GLSL shader support for custom visual effects

### UI Framework
- **Radix UI** - Comprehensive set of accessible, unstyled UI components
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Lucide React** - Icon library for UI elements
- **class-variance-authority** - Type-safe variant management for component styling

### Database and ORM
- **Drizzle ORM** with **drizzle-kit** - Type-safe PostgreSQL ORM
- **@neondatabase/serverless** - Serverless PostgreSQL database driver
- **connect-pg-simple** - PostgreSQL session store for Express

### Development Tools
- **TypeScript** - Static type checking and enhanced development experience
- **ESBuild** - Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting during development

### Utility Libraries
- **date-fns** - Date manipulation utilities
- **clsx** and **tailwind-merge** - Conditional CSS class management
- **nanoid** - Unique ID generation for game entities
- **cmdk** - Command palette functionality