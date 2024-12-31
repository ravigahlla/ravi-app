function TaskCard({ task, projects }) {
  return (
    <div className="task-card">
      <div className="task-content">
        <span className={task.isComplete ? 'completed' : ''}>
          {task.name}
        </span>
        <div className="task-project-indicators">
          {task.projectIds?.map(projectId => {
            const project = projects.find(p => p.id === projectId)
            if (!project) return null
            return (
              <div
                key={project.id}
                className="project-indicator"
                style={{ backgroundColor: project.color }}
                title={project.name}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
} 