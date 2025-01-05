import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import './TaskCard.css'

function TaskCard({ task, index, projects, onToggleComplete, onDelete, onTaskClick }) {
  const handleClick = (e) => {
    // Only handle clicks if not clicking a button or checkbox
    if (e.target.closest('button, input[type="checkbox"]')) {
      return;
    }
    onTaskClick(task);
  }

  const handleToggleComplete = (e) => {
    e.stopPropagation()
    onToggleComplete(task.id)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
    }
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={`task-card ${task.isComplete ? 'completed' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          data-testid="task-card"
        >
          <div className="task-header">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.isComplete}
              onChange={handleToggleComplete}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="task-content">
              <p className="task-name">{task.name}</p>
            </div>
            <button
              className="delete-button"
              onClick={handleDelete}
              aria-label="Delete task"
            >
              🗑
            </button>
          </div>
          
          {task.projectIds?.length > 0 && (
            <div className="task-footer">
              <div className="project-tags">
                {task.projectIds.map(projectId => {
                  const project = projects.find(p => p.id === projectId)
                  if (!project) return null
                  return (
                    <span
                      key={project.id}
                      className="project-tag"
                      style={{
                        '--project-color': `${project.color}15`,
                        borderColor: `${project.color}30`,
                        color: project.color.replace('15', '90')
                      }}
                    >
                      {project.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard 