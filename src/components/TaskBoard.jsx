import { Droppable } from '@hello-pangea/dnd'
import TaskList from './TaskList'
import './TaskBoard.css'

export default function TaskBoard({ 
  tasks = [],
  onToggleComplete = () => {}, 
  onTaskClick = () => {} 
}) {
  const columns = ['Todo', 'Now', 'Next', 'Later', 'Done']
  
  const getTasksByColumn = (columnName) => {
    return tasks.filter(task => task.column === columnName)
  }

  return (
    <div className="task-board">
      {columns.map(column => (
        <div key={column} className="column">
          <h2>{column}</h2>
          <Droppable droppableId={column}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-list"
              >
                <TaskList
                  tasks={getTasksByColumn(column)}
                  onToggleComplete={onToggleComplete}
                  onSelectTask={onTaskClick}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  )
} 