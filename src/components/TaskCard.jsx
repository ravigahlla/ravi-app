import { Draggable } from 'react-beautiful-dnd'
import './TaskCard.css'

export default function TaskCard({ task, index, onToggleComplete, onTaskClick, onDeleteTask, projects }) {
  const handleClick = (e) => {
    // Prevent opening details when clicking checkbox or delete button
    if (
      !e.target.classList.contains('task-checkbox') && 
      !e.target.classList.contains('delete-task')
    ) {
      onTaskClick(task)
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${task.isComplete ? 'completed' : ''} ${
            snapshot.isDragging ? 'dragging' : ''
          }`}
          onClick={handleClick}
        >
          <input
            type="checkbox"
            checked={task.isComplete}
            onChange={() => onToggleComplete(task.id)}
            className="task-checkbox"
          />
          <div className="task-content">
            <div className="task-header">
              <span className="task-name">{task.name}</span>
            </div>
            {task.projectIds?.length > 0 && (
              <div className="task-project-labels">
                {task.projectIds.map(projectId => {
                  const project = projects.find(p => p.id === projectId)
                  if (!project) return null
                  return (
                    <span
                      key={projectId}
                      className="project-label"
                      style={{ backgroundColor: project.color + '20', color: project.color }}
                    >
                      {project.name}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
          <button
            className="delete-task"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteTask(task.id)
            }}
          >
            ×
          </button>
        </div>
      )}
    </Draggable>
  )
} 