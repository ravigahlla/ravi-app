import { useState, useRef, useEffect } from 'react'
import './ProjectDetails.css'

function ProjectDetails({ 
  project, 
  tasks, 
  onClose, 
  onUpdate, 
  onAddTask, 
  onRemoveTask 
}) {
  const [notes, setNotes] = useState(project.notes)
  const [searchQuery, setSearchQuery] = useState('')
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

  const availableTasks = tasks.filter(task => 
    !project.taskIds.includes(task.id) &&
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const projectTasks = tasks.filter(task => 
    project.taskIds.includes(task.id)
  )

  const handleSave = () => {
    onUpdate({
      ...project,
      notes
    })
  }

  return (
    <div className="project-details-overlay">
      <div ref={modalRef} className="project-details">
        <div className="project-header">
          <h2>{project.name}</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="project-section">
          <h3>Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add project notes..."
            rows={4}
          />
        </div>

        <div className="project-section">
          <h3>Tasks</h3>
          <div className="search-tasks">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks to add..."
            />
          </div>

          {searchQuery && (
            <div className="search-results">
              {availableTasks.map(task => (
                <div 
                  key={task.id} 
                  className="task-search-item"
                  onClick={() => onAddTask(task.id)}
                >
                  <span>{task.name}</span>
                  <button>Add</button>
                </div>
              ))}
            </div>
          )}

          <div className="project-tasks">
            {projectTasks.map(task => (
              <div key={task.id} className="project-task-item">
                <span>{task.name}</span>
                <button 
                  onClick={() => onRemoveTask(task.id)}
                  className="remove-task"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="project-actions">
          <button onClick={handleSave}>Save Notes</button>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails 