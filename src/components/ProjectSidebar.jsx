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
      onCreateProject({
        id: Date.now().toString(),
        name: newProjectName,
        notes: '',
        taskIds: [],
        createdAt: Date.now()
      })
      setNewProjectName('')
    }
  }

  return (
    <div className={`project-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Projects</h2>
        <span className="collapsed-title">Projects</span>
        <button 
          onClick={onToggleExpand}
          className="toggle-button"
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      <div className="sidebar-content">
        <form onSubmit={handleCreateProject} className="new-project-form">
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
              className={`project-item ${selectedProjectId === project.id ? 'selected' : ''}`}
              onClick={() => onSelectProject(project.id)}
            >
              <span className="project-name">{project.name}</span>
              <span className="task-count">
                {project.taskIds.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectSidebar