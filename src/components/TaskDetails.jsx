import { useState, useRef, useEffect } from 'react'
import './TaskDetails.css'

function TaskDetails({ task, projects, onClose, onUpdate, onDelete, onToggleComplete, onAddToProject }) {
  const [notes, setNotes] = useState(task.notes || '')
  const [newSubTask, setNewSubTask] = useState('')
  const [subTasks, setSubTasks] = useState(task.subTasks || [])
  const [showProjectSelector, setShowProjectSelector] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isComplete, setIsComplete] = useState(task.isComplete || false)
  const modalRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Track changes in notes and subtasks
  useEffect(() => {
    const isSubTasksChanged = JSON.stringify(subTasks) !== JSON.stringify(task.subTasks || [])
    const isNotesChanged = notes !== (task.notes || '')
    const isCompletionChanged = isComplete !== task.isComplete
    setHasChanges(isNotesChanged || isSubTasksChanged || isCompletionChanged)
  }, [notes, subTasks, isComplete, task])

  const handleSave = () => {
    const updatedTask = {
      ...task,
      notes,
      subTasks: subTasks.map(st => ({
        id: st.id,
        text: st.text,
        completed: st.completed
      })),
      isComplete
    }
    onUpdate(updatedTask)
    onClose()
  }

  const handleToggleComplete = () => {
    setIsComplete(!isComplete)
    setHasChanges(true)
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
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
      onClose()
    }
  }

  const handleAddProject = () => {
    setShowProjectSelector(true)
  }

  const handleProjectSelect = (projectId) => {
    onAddToProject(task.id, projectId)
    setShowProjectSelector(false)
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
                checked={isComplete}
                onChange={handleToggleComplete}
              />
              <h2 
                id="task-title"
                className={isComplete ? 'completed' : ''}
              >
                {task.name}
              </h2>
            </div>
            <div className="project-tags" data-testid="project-tags-section">
              {task.projectIds?.map(projectId => {
                const project = projects.find(p => p.id === projectId)
                if (!project) return null
                return (
                  <span 
                    key={project.id}
                    className="project-tag"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name}
                  </span>
                )
              })}
              <button 
                onClick={handleAddProject}
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
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
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