export default function Task({ task, onToggleComplete, onSelect }) {
  return (
    <div 
      className={`task ${task.isComplete ? 'completed' : ''}`}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={task.isComplete}
        onChange={() => onToggleComplete(task._id)}
        onClick={e => e.stopPropagation()}
      />
      <span className="task-name">{task.name}</span>
    </div>
  );
} 