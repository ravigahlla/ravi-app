# Raviflo

A modern task management application built with React that helps users organize their work through a customizable Kanban board interface.

## Version
- v0.2.0 - Added MongoDB integration and Auth0 authentication
- Requires Node.js >= 18
- Requires MongoDB >= 6.0

## Technology Stack

### Frontend
- React 18 with Vite
- @hello-pangea/dnd for drag and drop
- react-hot-toast for notifications
- Auth0 for authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- CORS for cross-origin resource sharing
- ESM modules throughout

## Architecture

```
Frontend (localhost:5173)           Backend (localhost:5001)
┌─────────────────┐                ┌─────────────────┐
│     React       │                │    Express      │
│   Components    │ ←── REST ────→ │     Server      │
└─────────────────┘                └─────────────────┘
         ↑                                   ↑
         │                                   │
         │                          ┌─────────────────┐
         │                          │    MongoDB      │
         └──── Auth0 ────→          │   (27017)      │
                                    └─────────────────┘
```

## Setup Instructions

1. Clone the repository:
```bash
git clone git@github.com:yourusername/raviflo-app.git
cd raviflo-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cp .env.example .env.development

# Update both files with your values:
# - VITE_AUTH0_DOMAIN (from Auth0 dashboard)
# - VITE_AUTH0_CLIENT_ID (from Auth0 dashboard)
# - MONGODB_URI (default: mongodb://localhost:27017/raviflo_dev)
```

4. Set up MongoDB:
```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

5. Initialize the database:
```bash
# Reset database and add development seed data
npm run db:reset
npm run db:seed
```

6. Start the servers:
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run dev
```

Visit http://localhost:5173 and log in with Auth0

## Development Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run db:seed` - Seed database with development data
- `npm run db:reset` - Clear database
- `npm run dev:fresh` - Reset DB, seed, and start development

## Database Structure

### Tasks Collection
```javascript
{
  name: String,          // required
  column: String,        // Todo, Now, Next, Later, Done
  projectId: ObjectId,   // reference to Projects
  userId: String,        // Auth0 user ID
  isComplete: Boolean,
  notes: String,
  subTasks: [String]
}
```

### Projects Collection
```javascript
{
  name: String,          // required
  userId: String,        // Auth0 user ID
  notes: String,
  color: String,
  taskIds: [ObjectId]    // reference to Tasks
}
```

## Project Goal

Raviflo aims to provide a simple yet powerful task management solution that allows users to:
- Organize tasks across different stages (Todo, Now, Next, Later, Done)
- Group tasks into projects
- Track task completion
- Manage task details and subtasks
- Drag and drop tasks between columns

## Features

### Task Management
- Create, edit, and delete tasks
- Add notes and subtasks to any task
- Mark tasks as complete
- Drag and drop tasks between columns
- View task history and previous states

### Project Organization
- Create and manage projects
- Assign tasks to projects
- Color-code projects for easy identification
- Track project progress through task completion

### User Interface
- Responsive design for mobile and desktop
- Collapsible project sidebar
- Dark/light mode support
- Toast notifications for important actions
- Drag and drop interface

### Authentication & Data
- Secure authentication via Auth0
- User-specific data storage
- Automatic data persistence

## Version History

### v2.0.0 - MongoDB Integration
- Migrated to MongoDB for persistent data storage
- Updated task and project schemas with proper relationships
- Added server-side data validation
- Improved error handling and API responses
- Added migration support for existing data

### v1.0.0 - Initial Release
- Basic task management functionality
- Project creation and management
- Drag and drop interface
- Auth0 integration

### v0.2.0 - Project Management
- Added project support
- Implemented task-project relationships
- Added color coding for projects
- Improved task organization

### v0.1.0 - Core Features
- Task creation and management
- Kanban board interface
- Basic state management
- Initial UI implementation

## Technical Stack

- React 18
- Vite
- Auth0 for authentication
- React Beautiful DND for drag and drop
- React Hot Toast for notifications
- Jest and React Testing Library for testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

The project uses Jest and React Testing Library for testing. Tests are organized into:
- Component tests
- Flow tests (integration)
- Context tests

Run specific test suites:
```bash
npm run test:components
npm run test:flows
npm run test:organization
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Recent Updates

- Fixed duplicate project creation handling
  - Added proper error toast when attempting to create projects with duplicate names
  - Updated toast mocking strategy in tests
  - Added more comprehensive test coverage for duplicate project scenarios
  - Fixed mock implementation to properly handle both default and named exports

## Development

### Development Environment Setup

The application supports different environments with corresponding data setups:

1. **Environment Configuration**
   ```bash
   # Copy the appropriate .env file
   cp .env.development .env
   ```

2. **Database Setup**
   ```bash
   # Reset the database (removes all data)
   npm run db:reset

   # Seed with development data
   npm run db:seed

   # Or do both and start the app
   npm run dev:fresh
   ```

3. **Test Data**
   - Development environment includes sample tasks and projects
   - Seed data is only loaded in development
   - Data can be reset anytime with `npm run dev:fresh`
   - Modify seed data in `server/seeds/` directory

### Adding New Features

1. **Test First**
   - Write integration tests in `__tests__/flows/`
   - Set up mocks in `setupTests.js`
   - Implement the feature
   - Verify all tests pass

2. **Required Mocks**
   - Auth0 authentication
   - Toast notifications
   - Local storage
   - API calls
   - Third-party services

3. **Integration Test Structure**
   ```javascript
   describe('Feature Flow', () => {
     beforeEach(() => {
       // Set up mocks
       // Clear storage
     })

     it('completes the feature flow successfully', async () => {
       // Render
       // Interact
       // Assert
     })

     it('handles error cases appropriately', async () => {
       // Test error scenarios
     })
   })
   ```

4. **Component Testing**
   - Unit tests for individual components
   - Mock all dependencies
   - Test both success and error states

...