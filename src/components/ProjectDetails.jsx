import { useState, useRef, useEffect } from 'react'
import './ProjectDetails.css'

function ProjectDetails({ 
  project, 
  tasks, 
  onClose, 
  onUpdate, 
  onAddTask, 
  onRemoveTask,
  onCreateTask,
  requireNameChange = false
}) {
  const [notes, setNotes] = useState(project.notes)
  const [searchQuery, setSearchQuery] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('Todo')
  const [color, setColor] = useState(project.color)
  const [name, setName] = useState(project.name)
  const [hasChanges, setHasChanges] = useState(false)
  const modalRef = useRef(null)
  
  const columns = ['Todo', 'Now', 'Next', 'Later']
  const colors = [
    '#6c757d', // Gray
    '#007bff', // Blue
    '#28a745', // Green
    '#dc3545', // Red
    '#ffc107', // Yellow
    '#17a2b8', // Cyan
    '#6f42c1', // Purple
    '#fd7e14', // Orange
  ]
  
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

  useEffect(() => {
    const isChanged = 
      name !== project.name ||
      notes !== project.notes ||
      color !== project.color;
    
    setHasChanges(isChanged);
  }, [name, notes, color, project]);

  const availableTasks = tasks.filter(task => 
    !project.taskIds.includes(task.id) &&
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const projectTasks = tasks.filter(task => 
    project.taskIds.includes(task.id)
  )

  const handleCreateTask = (e) => {
    e.preventDefault()
    if (newTaskName.trim()) {
      const taskId = onCreateTask(newTaskName, selectedColumn)
      setNewTaskName('')
      setSelectedColumn('Todo')
    }
  }

  const handleSave = () => {
    if (requireNameChange && name === 'Sample Project') {
      return;
    }
    
    if (name.trim()) {
      onUpdate({
        ...project,
        name: name.trim(),
        notes,
        color
      });
      onClose();
    }
  }

  const getColorName = (hexColor) => {
    const colorMap = {
      '#6c757d': 'Gray',
      '#007bff': 'Blue',
      '#28a745': 'Green',
      '#dc3545': 'Red',
      '#ffc107': 'Yellow',
      '#17a2b8': 'Cyan',
      '#6f42c1': 'Purple',
      '#fd7e14': 'Orange'
    };
    return colorMap[hexColor] || 'Custom';
  };

  return (
    <div className="project-details-overlay">
      <div ref={modalRef} className="project-details">
        <div className="project-header">
          <div className="project-header-left">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name your Project..."
              className={requireNameChange && name === '' ? 'needs-change' : ''}
            />
            <div className="color-picker-section">
              <span className="color-picker-label">Select project color</span>
              <div className="color-picker">
                {colors.map(c => (
                  <button
                    key={c}
                    className={`color-option ${c === color ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    title={`Select ${getColorName(c)} color`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="project-section">
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask} className="create-task-form">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="New task name..."
            />
            <select 
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
            <button type="submit">Create</button>
          </form>
        </div>

        <div className="project-section">
          <h3>Add Existing Tasks</h3>
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

        <div className="project-section">
          <h3>Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add project notes..."
            rows={4}
          />
        </div>

        <div className="modal-actions">
          <a 
            className="cancel-link" 
            onClick={onClose}
            href="#"
          >
            Cancel
          </a>
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={!hasChanges || (requireNameChange && name === 'Sample Project')}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails 