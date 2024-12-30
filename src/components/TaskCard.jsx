function TaskCard({ task, projects }) {
  const taskProjects = projects.filter(p => 
    task.projectIds?.includes(p.id)
  )

  return (
    <div className="task-card">
      <span>{task.name}</span>
      {taskProjects.length > 0 && (
        <div className="project-badges">
          {taskProjects.map(project => (
            <span key={project.id} className="project-badge">
              {project.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
} 