import { useState } from 'react'
import ProjectDetails from './ProjectDetails'
import './ProjectSidebar.css'

function ProjectSidebar({ 
  projects, 
  onCreateProject, 
  onSelectProject, 
  selectedProjectId,
  isExpanded,
  onToggleExpand 
}) {
  const [newProjectName, setNewProjectName] = useState('')
  const [showProjectModal, setShowProjectModal] = useState(false)

  const handleCreateProject = (e) => {
    e.preventDefault()
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim())
      setNewProjectName('')
    }
  }

  const sampleProject = {
    id: 'sample',
    name: 'Sample Project',  // Default name that user must change
    taskIds: [],
    notes: 'Add your project notes here...',
    color: '#6c757d'
  }

  return (
    <div className={`project-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isExpanded ? (
          <h2 className="sidebar-title">Projects</h2>
        ) : (
          <span className="collapsed-title">Projects</span>
        )}
        <button 
          className="toggle-button"
          onClick={onToggleExpand}
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      {isExpanded ? (
        <form 
          className="new-project-form" 
          onSubmit={handleCreateProject}
          data-testid="new-project-form"
        >
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name..."
          />
          <button type="submit">Create</button>
        </form>
      ) : (
        <button 
          className="add-project-button"
          onClick={() => setShowProjectModal(true)}
          title="Create new project"
        >
          +
        </button>
      )}

      <div className="projects-list" data-testid="projects-list">
        {projects.map(project => (
          <div
            key={project._id}
            className={`project-item ${project._id === selectedProjectId ? 'selected' : ''}`}
            onClick={() => onSelectProject(project._id)}
          >
            <div 
              className="project-color-indicator"
              style={{ backgroundColor: project.color }}
            />
            <span className="project-name">{project.name}</span>
            <span className="task-count">{project.taskIds.length}</span>
          </div>
        ))}
      </div>

      {showProjectModal && (
        <ProjectDetails
          project={sampleProject}
          tasks={[]}
          onClose={() => setShowProjectModal(false)}
          onUpdate={(updatedProject) => {
            if (updatedProject.name.trim() && updatedProject.name !== 'Sample Project') {
              onCreateProject(updatedProject.name.trim())
              setShowProjectModal(false)
            }
          }}
          requireNameChange={true}
        />
      )}
    </div>
  )
}

export default ProjectSidebar