import { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TaskDetails from './TaskDetails'
import './TaskColumn.css'

function TaskColumn({ title, tasks, onToggleComplete, onUpdateTask, onDeleteTask }) {
  const [selectedTask, setSelectedTask] = useState(null)

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  const handleTaskUpdate = (updatedTask) => {
    onUpdateTask(updatedTask)
    setSelectedTask(null)
  }

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
                onClick={() => handleTaskClick(task)}
              >
                <input
                  type="checkbox"
                  checked={task.isComplete}
                  onChange={() => onToggleComplete(task.id)}
                  onClick={e => e.stopPropagation()}
                />
                <span>{task.name}</span>
                {task.subTasks?.length > 0 && (
                  <span className="sub-tasks-indicator">
                    {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}
                  </span>
                )}
              </div>
            )}
          </Draggable>
        ))}
      </div>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={onDeleteTask}
        />
      )}
    </div>
  )
}

export default TaskColumn 