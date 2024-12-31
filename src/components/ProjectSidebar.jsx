import { useState } from 'react'
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

  const handleCreateProject = (e) => {
    e.preventDefault()
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim())
      setNewProjectName('')
    }
  }

  return (
    <div className={`project-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Projects</h2>
        <button 
          onClick={onToggleExpand}
          className="toggle-button"
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      <form onSubmit={handleCreateProject} className="add-project-form">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name..."
        />
        <button type="submit">Create</button>
      </form>

      <div className="projects-list">
        {projects.map(project => (
          <div
            key={project.id}
            className={`project-item ${project.id === selectedProjectId ? 'selected' : ''}`}
            onClick={() => onSelectProject(project.id)}
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
    </div>
  )
}

export default ProjectSidebar