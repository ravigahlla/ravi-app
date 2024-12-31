import { Droppable } from 'react-beautiful-dnd'
import TaskColumn from './TaskColumn'
import './TaskBoard.css'
import { useState } from 'react'
import TaskDetails from './TaskDetails'

function TaskBoard({ tasks, projects, onToggleComplete, onUpdateTask, onDeleteTask }) {
  const [selectedTask, setSelectedTask] = useState(null)
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
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  projects={projects}
                  onSelectTask={setSelectedTask}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          projects={projects}
          onClose={() => setSelectedTask(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      )}
    </div>
  )
}

export default TaskBoard 