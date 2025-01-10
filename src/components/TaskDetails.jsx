import { useState, useRef, useEffect } from 'react'
import './TaskDetails.css'

function TaskDetails({ task, projects, onClose, onUpdate, onDelete }) {
  const [name, setName] = useState(task.name)
  const [notes, setNotes] = useState(task.notes || '')
  const [subTasks, setSubTasks] = useState(task.subTasks || [])
  const [showProjectSelector, setShowProjectSelector] = useState(false)
  const [newSubTask, setNewSubTask] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    const isChanged = 
      name !== task.name ||
      notes !== (task.notes || '') ||
      JSON.stringify(subTasks) !== JSON.stringify(task.subTasks || []);
      
    setHasChanges(isChanged);
  }, [name, notes, subTasks, task]);

  const handleSave = () => {
    if (name.trim()) {
      onUpdate({
        _id: task._id,
        name: name.trim(),
        notes,
        subTasks,
        column: task.column,
        isComplete: task.isComplete,
        projectId: task.projectId
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task._id)
      onClose()
    }
  }

  const handleAddSubTask = (e) => {
    e.preventDefault()
    if (newSubTask.trim()) {
      setSubTasks([
        ...subTasks,
        { id: Date.now().toString(), text: newSubTask, completed: false }
      ])
      setNewSubTask('')
      setHasChanges(true)
    }
  }

  const toggleSubTask = (subTaskId) => {
    setSubTasks(subTasks.map(st => 
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    ))
    setHasChanges(true)
  }

  return (
    <div className="task-details-overlay">
      <div 
        className="task-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-title"
        ref={modalRef}
      >
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="task-title-row">
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.isComplete}
                onChange={() => {
                  onUpdate({
                    ...task,
                    isComplete: !task.isComplete
                  });
                }}
              />
              <h2 
                id="task-title"
                className={task.isComplete ? 'completed' : ''}
              >
                {task.name}
              </h2>
            </div>
            <div className="project-tags" data-testid="project-tags-section">
              {task.projectId && projects.map(project => {
                if (project._id !== task.projectId) return null;
                return (
                  <span 
                    key={project._id}
                    className="project-tag"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name}
                  </span>
                )
              })}
              <button 
                onClick={() => setShowProjectSelector(true)}
                data-testid="add-project-button"
                aria-label="Add project"
              >
                Add Project
              </button>
            </div>
          </div>
          <button 
            className="delete-button" 
            onClick={handleDelete}
            aria-label="Delete task"
          >
            🗑
          </button>
        </div>

        {showProjectSelector && (
          <div className="project-selector">
            {projects.map(project => (
              <button
                key={project._id}
                onClick={() => {
                  onUpdate({
                    ...task,
                    projectId: project._id
                  });
                  setShowProjectSelector(false)
                }}
                className="project-option"
              >
                {project.name}
              </button>
            ))}
          </div>
        )}

        <div className="details-section">
          <h3 id="subtasks-label">Sub-tasks</h3>
          <form className="sub-task-form" onSubmit={handleAddSubTask}>
            <input
              type="text"
              value={newSubTask}
              onChange={(e) => setNewSubTask(e.target.value)}
              placeholder="Add new sub-task..."
              aria-labelledby="subtasks-label"
            />
            <button 
              type="submit"
              data-testid="add-subtask-button"
            >
              Add
            </button>
          </form>

          <div className="sub-tasks-list">
            {subTasks.map(subTask => (
              <div key={subTask.id} className="sub-task-item">
                <input
                  type="checkbox"
                  checked={subTask.completed}
                  onChange={() => toggleSubTask(subTask.id)}
                />
                <span className={subTask.completed ? 'completed' : ''}>
                  {subTask.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider"></div>

        <div className="details-section notes-section">
          <h3 id="notes-label">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            rows="4"
            aria-labelledby="notes-label"
          />
        </div>

        <div className="modal-actions">
          <button 
            className="cancel-button" 
            onClick={() => {
              if (hasChanges) {
                if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                  onClose()
                }
              } else {
                onClose()
              }
            }}
          >
            Cancel
          </button>
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails 