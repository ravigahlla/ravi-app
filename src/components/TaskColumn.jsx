import './TaskColumn.css'

function TaskColumn({ title, tasks, onToggleComplete }) {
  return (
    <div className="task-column">
      <h2>{title}</h2>
      <div className="tasks">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={() => onToggleComplete(task.id)}
            />
            <span>{task.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskColumn 