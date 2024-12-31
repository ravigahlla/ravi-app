function TaskCard({ task, projects, onToggleComplete, onClick }) {
  return (
    <div className="task-card" onClick={onClick}>
      <div className="task-content">
        <div className="task-header">
          <input
            type="checkbox"
            checked={task.isComplete}
            onChange={() => onToggleComplete(task.id)}
            onClick={e => e.stopPropagation()}
          />
          <span className={task.isComplete ? 'completed' : ''}>
            {task.name}
          </span>
        </div>
        
        {task.projectIds?.length > 0 && (
          <div className="task-project-labels">
            {task.projectIds.map(projectId => {
              const project = projects.find(p => p.id === projectId)
              if (!project) return null
              return (
                <span 
                  key={project.id}
                  className="project-label"
                  style={{ 
                    backgroundColor: project.color,
                    color: getContrastColor(project.color)
                  }}
                >
                  {project.name}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to determine text color based on background
function getContrastColor(hexcolor) {
  // Remove the # if present
  const hex = hexcolor.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export default TaskCard 