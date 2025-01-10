import { useState, useRef, useEffect } from 'react'
import './ProjectDetails.css'
import { api } from '../services/api.js'

function ProjectDetails({ 
  project, 
  tasks: initialTasks, 
  onClose, 
  onUpdate, 
  onAddTask, 
  onRemoveTask,
  onCreateTask,
  onDelete,
  requireNameChange = false,
  className = ''
}) {
  const [notes, setNotes] = useState(project?.notes || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('Todo')
  const [color, setColor] = useState(project?.color || '#6c757d')
  const [name, setName] = useState(project?.name || '')
  const [hasChanges, setHasChanges] = useState(false)
  const modalRef = useRef(null)
  const [tasks, setTasks] = useState(initialTasks)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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
      name !== project?.name ||
      notes !== project?.notes ||
      color !== project?.color;
    
    setHasChanges(isChanged);
  }, [name, notes, color, project]);

  useEffect(() => {
    if (project) {
      setNotes(project.notes || '')
      setColor(project.color || '#6c757d')
      setName(project.name || '')
      loadTasks()
    }
  }, [project?._id]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks(project.id);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  const availableTasks = tasks.filter(task => 
    !project.taskIds.includes(task._id) &&
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const projectTasks = tasks.filter(task => 
    project.taskIds.includes(task._id)
  )

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await api.createTask({
        ...taskData,
        projectId: project.id
      });
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = () => {
    if (requireNameChange && name === 'Sample Project') {
      return;
    }
    
    if (name.trim()) {
      onUpdate({
        _id: project._id,
        name: name.trim(),
        notes,
        color,
        taskIds: project.taskIds
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

  const handleMoveTask = async (taskId, newColumn) => {
    try {
      const updatedTask = await api.updateTask(taskId, { column: newColumn });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const projectTasks = tasks.filter(task => task.projectId === project._id);
    if (projectTasks.length > 0) {
      const shouldDeleteTasks = window.confirm(
        `This project has ${projectTasks.length} task${projectTasks.length === 1 ? '' : 's'} associated with it. ` +
        `Would you like to delete ${projectTasks.length === 1 ? 'this task' : 'these tasks'} as well?`
      );
      onDelete(project._id, shouldDeleteTasks);
    } else {
      if (window.confirm('Are you sure you want to delete this project?')) {
        onDelete(project._id, false);
      }
    }
    onClose();
  };

  return (
    project ? (
      <div className={`project-details-overlay ${className}`}>
        <div 
          ref={modalRef} 
          className="project-details"
        >
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
              className="delete-button"
              onClick={handleDelete}
              style={{ marginRight: 'auto' }}
            >
              Delete Project
            </button>
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
    ) : null
  )
}

export default ProjectDetails 