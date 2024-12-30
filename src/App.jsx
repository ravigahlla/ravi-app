import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './App.css'
import TaskBoard from './components/TaskBoard'
import AddTaskForm from './components/AddTaskForm'

function App() {
  const [tasks, setTasks] = useState([])

  const addTask = (taskName) => {
    const newTask = {
      id: Date.now().toString(),
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

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const updatedTasks = Array.from(tasks)
    const movedTask = updatedTasks.find(task => task.id === draggableId)
    
    if (movedTask) {
      movedTask.column = destination.droppableId
      movedTask.previousColumn = destination.droppableId === 'Done' 
        ? source.droppableId 
        : destination.droppableId
      movedTask.isComplete = destination.droppableId === 'Done'
    }

    setTasks(updatedTasks)
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <AddTaskForm onAddTask={addTask} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <TaskBoard tasks={tasks} onToggleComplete={toggleComplete} />
      </DragDropContext>
    </div>
  )
}

export default App
