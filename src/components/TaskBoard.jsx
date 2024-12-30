import { Droppable } from 'react-beautiful-dnd'
import TaskColumn from './TaskColumn'
import './TaskBoard.css'

function TaskBoard({ tasks, onToggleComplete }) {
  const columns = ['Todo', 'Now', 'Next', 'Later', 'Done']

  return (
    <div className="task-board">
      {columns.map(column => (
        <div key={column} className="column-container">
          <Droppable droppableId={column}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`droppable-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              >
                <TaskColumn
                  title={column}
                  tasks={tasks.filter(task => task.column === column)}
                  onToggleComplete={onToggleComplete}
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

export default TaskBoard 