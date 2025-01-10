# Raviflo

A modern task management application built with React that helps users organize their work through a customizable Kanban board interface.

## Project Goal

Raviflo aims to provide a simple yet powerful task management solution that allows users to:
- Organize tasks across different stages (Todo, Now, Next, Later, Done)
- Group tasks into projects
- Track task completion
- Manage task details and subtasks
- Drag and drop tasks between columns

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

3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```

4. Run the migration script (if updating from previous version):
```bash
node server/migrate.js
```

5. Start the development server:
```bash
npm run dev
```

6. Start the backend server:
```bash
npm run server
```

The app will be available at `http://localhost:5173`

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

### v1.0.0 - Initial Release
- Basic task management functionality
- Project creation and management
- Drag and drop interface
- Auth0 integration

### v0.2.0 - Project Management Update
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