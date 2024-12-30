import { useState } from 'react'
import './App.css'
import TaskBoard from './components/TaskBoard'
import AddTaskForm from './components/AddTaskForm'

function App() {
  const [tasks, setTasks] = useState([])

  const addTask = (taskName) => {
    const newTask = {
      id: Date.now(),
      name: taskName,
      column: 'Todo',
      isComplete: false,
      previousColumn: 'Todo'
    }
    setTasks([...tasks, newTask])
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isComplete: !task.isComplete,
          previousColumn: task.column,
          column: !task.isComplete ? 'Done' : task.previousColumn
        }
      }
      return task
    }))
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <AddTaskForm onAddTask={addTask} />
      <TaskBoard tasks={tasks} onToggleComplete={toggleComplete} />
    </div>
  )
}

export default App
