import { Droppable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
import './TaskBoard.css'

export default function TaskBoard({ tasks, projects, onTaskClick, onToggleComplete, onDeleteTask }) {
  const columns = ['Todo', 'Now', 'Next', 'Later', 'Done']

  return (
    <div className="task-board">
      {columns.map(column => (
        <div key={column} className="task-column">
          <h2>{column}</h2>
          <Droppable droppableId={column}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`task-list ${snapshot?.isDraggingOver ? 'drop-target' : ''}`}
              >
                {tasks
                  .filter(task => task.column === column)
                  .map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      projects={projects}
                      onTaskClick={onTaskClick}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDeleteTask}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  )
} 