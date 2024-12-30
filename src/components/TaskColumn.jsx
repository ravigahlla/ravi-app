import { Draggable } from 'react-beautiful-dnd'
import './TaskColumn.css'

function TaskColumn({ title, tasks, onToggleComplete }) {
  return (
    <div className="task-column">
      <h2>{title}</h2>
      <div className="tasks">
        {tasks.map((task, index) => (
          <Draggable
            key={task.id}
            draggableId={task.id}
            index={index}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.isComplete}
                  onChange={() => onToggleComplete(task.id)}
                  onClick={e => e.stopPropagation()}
                />
                <span>{task.name}</span>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  )
}

export default TaskColumn 