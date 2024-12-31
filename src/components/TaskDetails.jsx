import { useState, useRef, useEffect } from 'react'
import './TaskDetails.css'

function TaskDetails({ task, projects, onClose, onUpdate, onDelete }) {
  const [notes, setNotes] = useState(task.notes || '')
  const [newSubTask, setNewSubTask] = useState('')
  const [subTasks, setSubTasks] = useState(task.subTasks || [])
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

  const handleSave = () => {
    onUpdate({
      ...task,
      notes,
      subTasks
    })
    onClose()
  }

  const handleAddSubTask = (e) => {
    e.preventDefault()
    if (newSubTask.trim()) {
      setSubTasks([
        ...subTasks,
        { id: Date.now().toString(), text: newSubTask, completed: false }
      ])
      setNewSubTask('')
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

  return (
    <div className="task-details-overlay">
      <div ref={modalRef} className="task-details-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <h2>{task.name}</h2>
            <div className="project-tags">
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
            </div>
          </div>
          <button className="delete-button" onClick={onDelete}>🗑</button>
        </div>

        <div className="details-section">
          <h3>Sub-tasks</h3>
          <form onSubmit={handleAddSubTask} className="sub-task-form">
            <input
              type="text"
              value={newSubTask}
              onChange={(e) => setNewSubTask(e.target.value)}
              placeholder="Add new sub-task..."
            />
            <button type="submit">Add</button>
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
          <h3>Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            rows={4}
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails 