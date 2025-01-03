import { Draggable } from 'react-beautiful-dnd'
import './TaskCard.css'

function TaskCard({ task, index, projects, onToggleComplete, onDelete, onTaskClick }) {
  const handleClick = (e, isDragging) => {
    // Only handle clicks if we're not dragging and not clicking a button or checkbox
    if (isDragging || e.target.closest('button, input[type="checkbox"]')) {
      return;
    }
    onTaskClick(task);
  }

  const handleCheckboxChange = (e) => {
    e.stopPropagation() // Prevent the click from bubbling up
    onToggleComplete(task.id)
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot?.isDragging ? 'dragging' : ''}`}
          onClick={(e) => handleClick(e, snapshot?.isDragging)}
          data-testid="task-card"
        >
          <div className="task-content">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.isComplete}
              onChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              data-testid="task-checkbox"
            />
            <span className={task.isComplete ? 'completed' : ''}>
              {task.name}
            </span>
          </div>
          <div className="task-actions">
            {task.projectIds?.map(projectId => {
              const project = projects.find(p => p.id === projectId)
              if (!project) return null
              return (
                <span 
                  key={project.id}
                  className="project-tag"
                  style={{ backgroundColor: project.color }}
                >
                  {project.name}
                </span>
              )
            })}
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id)
                }
              }}
              data-testid="delete-task-button"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard 