import { Droppable } from 'react-beautiful-dnd'
import TaskColumn from './TaskColumn'
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
          <div className="tasks">
            {tasks
              .filter(task => task.column === column)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={projects}
                  onToggleComplete={onToggleComplete}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
          </div>
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