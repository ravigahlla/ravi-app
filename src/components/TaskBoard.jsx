import { Droppable, Draggable } from 'react-beautiful-dnd'
import TaskCard from './TaskCard'
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
          <h2>{column}</h2>
          <Droppable droppableId={column}>
            {(provided, snapshot = {}) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`tasks ${snapshot?.isDraggingOver ? 'dragging-over' : ''}`}
              >
                {tasks
                  .filter(task => task.column === column)
                  .map((task, index) => (
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
                        >
                          <TaskCard
                            task={task}
                            projects={projects}
                            onToggleComplete={onToggleComplete}
                            onClick={() => setSelectedTask(task)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
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
          onToggleComplete={onToggleComplete}
        />
      )}
    </div>
  )
}

export default TaskBoard 