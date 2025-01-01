# Raviflo

A personal task management and goal manifestation application built with React that helps users organize tasks and group them into projects. The app features a kanban-style board with drag-and-drop functionality and a collapsible project sidebar.

## Features

### Task Management
- Create and organize tasks across different stages:
  - Todo
  - Now
  - Next
  - Later
  - Done
- Drag and drop tasks between columns
- Mark tasks as complete/incomplete
- Tasks return to their previous column when uncompleted
- Add notes and sub-tasks to any task
- Track sub-task completion progress
- Delete tasks with confirmation

### Project Organization
- Create and manage projects via collapsible sidebar
- Add existing tasks to projects
- Remove tasks from projects
- Add project-specific notes
- View task count per project
- Collapsible project sidebar with vertical title
- Search and filter tasks when adding to projects

### User Interface
- Responsive design
- Smooth animations and transitions
- Click-outside to close modals
- Visual feedback for drag operations
- Intuitive project management
- Compact/expanded sidebar views

## Development History

### Phase 1: Basic Task Management
- Initial setup with Vite and React
- Basic task creation and column organization
- Task completion toggling

### Phase 2: Enhanced Task Features
- Drag and drop functionality
- Task details modal
- Notes and sub-tasks
- Previous column memory

### Phase 3: Project Management
- Project sidebar implementation
- Project creation and management
- Task-project associations
- Collapsible sidebar with improved UX

## Technologies Used

- React 18
- Vite
- react-beautiful-dnd
- CSS3
- JavaScript (ES6+)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
2. Install dependencies
3. Run the development server
4. Open your browser and visit `http://localhost:5173`

## Project Structure
task-manager/
├── src/
│ ├── components/
│ │ ├── AddTaskForm/ # Task creation
│ │ ├── TaskBoard/ # Main board with columns
│ │ ├── TaskColumn/ # Individual columns
│ │ ├── TaskDetails/ # Task modal with notes/sub-tasks
│ │ ├── ProjectSidebar/ # Collapsible project management
│ │ └── ProjectDetails/ # Project modal
│ ├── App.jsx # Main application component
│ ├── App.css # Global styles
│ └── main.jsx # Entry point
├── public/
├── package.json
└── README.md


## Future Enhancements

- [ ] Local storage persistence
- [ ] Task filtering and search
- [ ] Due dates and reminders
- [ ] Task labels/tags
- [ ] Multi-select operations
- [ ] Keyboard shortcuts
- [ ] Task attachments
- [ ] Project sharing
- [ ] Task dependencies

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release with basic task management
- Drag and drop functionality between columns
- Basic task creation and deletion

### Version 1.1.0
- Added project management system
- Collapsible project sidebar
- Ability to create and manage projects
- Associate tasks with projects

### Version 1.2.0
- Added task details modal
- Sub-tasks functionality with completion tracking
- Notes section for tasks
- Auto-saving for task updates

### Version 1.3.0
- Project color customization
- Color picker in project details
- Project color indicators in sidebar
- Project tags in task details
- Subtle project color indicators in task cards
- Auto-saving for project notes
- Improved project-task association UI

### Version 1.4.0
- Migrated from Firebase to Auth0 authentication
  - Enhanced privacy by removing AI-integrated services
  - Secure user authentication flow
  - Profile management with Auth0
  - Configurable social login options
- Improved task card UI/UX
  - Left-aligned task text for better readability
  - Refined spacing and layout
  - Enhanced interaction states
  - Improved drag-and-drop visual feedback
- Profile features
  - User avatar support
  - Account settings management
  - Secure logout functionality
- General improvements
  - Better error handling
  - Smoother transitions
  - More consistent styling

## Testing
The application uses Jest and React Testing Library for testing. Test files are located in `__tests__` directories next to the components they test.

### Test Structure
- Unit tests for individual components
- Integration tests for component interactions
- Mocked external dependencies (react-beautiful-dnd, react-hot-toast)
- Accessibility testing with ARIA roles

### Key Test Files
- `App.test.jsx` - Main application tests
- `TaskBoard.test.jsx` - Task board functionality
- `TaskDetails.test.jsx` - Task modal and form tests
- `ProjectSidebar.test.jsx` - Project management tests

### Testing Libraries
- Jest
- React Testing Library
- @testing-library/jest-dom
- @testing-library/user-event

## Accessibility
The application follows accessibility best practices:
- ARIA roles and attributes for interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly modals and dialogs

---
Built with ❤️ using React and Vite

## Features

- Drag-and-drop task management
- Project organization and tracking
- Real-time task status updates
- User authentication via Auth0
- Profile management
- Project-based task filtering
- Responsive design
- Intuitive task layout
  - Left-aligned task text for better readability
  - Clean, consistent spacing
  - Improved task card interactions