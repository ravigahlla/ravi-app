import TaskColumn from './TaskColumn'
import './TaskBoard.css'

function TaskBoard({ tasks, onToggleComplete }) {
  const columns = ['Todo', 'Now', 'Next', 'Later', 'Done']

  return (
    <div className="task-board">
      {columns.map(column => (
        <TaskColumn
          key={column}
          title={column}
          tasks={tasks.filter(task => task.column === column)}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  )
}

export default TaskBoard 