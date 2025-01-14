import { useState } from 'react'
import './AddTaskForm.css'

function AddTaskForm({ onAddTask }) {
  const [taskName, setTaskName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName.trim()) {
      onAddTask(taskName.trim())
      setTaskName('')
    }
  }

  return (
    <form 
      className="add-task-form" 
      onSubmit={handleSubmit}
      data-testid="add-task-form"
    >
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter new task..."
      />
      <button type="submit">Add Task</button>
    </form>
  )
}

export default AddTaskForm 