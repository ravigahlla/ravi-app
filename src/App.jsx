import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './App.css'
import TaskBoard from './components/TaskBoard'
import AddTaskForm from './components/AddTaskForm'
import ProjectSidebar from './components/ProjectSidebar'
import ProjectDetails from './components/ProjectDetails'

function App() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

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

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const createProject = (project) => {
    setProjects([...projects, project])
  }

  const updateProject = (updatedProject) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ))
  }

  const addTaskToProject = (projectId, taskId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          taskIds: [...p.taskIds, taskId]
        }
      }
      return p
    }))

    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          projectIds: [...(t.projectIds || []), projectId]
        }
      }
      return t
    }))
  }

  const removeTaskFromProject = (projectId, taskId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          taskIds: p.taskIds.filter(id => id !== taskId)
        }
      }
      return p
    }))

    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          projectIds: (t.projectIds || []).filter(id => id !== projectId)
        }
      }
      return t
    }))
  }

  return (
    <div className="app-container">
      <ProjectSidebar
        projects={projects}
        onCreateProject={createProject}
        onSelectProject={setSelectedProjectId}
        selectedProjectId={selectedProjectId}
        isExpanded={isSidebarExpanded}
        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
      />

      <div className={`main-content ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
        <h1>Task Manager</h1>
        <AddTaskForm onAddTask={addTask} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <TaskBoard 
            tasks={tasks}
            projects={projects}
            onToggleComplete={toggleComplete}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </DragDropContext>

        {selectedProjectId && (
          <ProjectDetails
            project={projects.find(p => p.id === selectedProjectId)}
            tasks={tasks}
            onClose={() => setSelectedProjectId(null)}
            onUpdate={updateProject}
            onAddTask={(taskId) => addTaskToProject(selectedProjectId, taskId)}
            onRemoveTask={(taskId) => removeTaskFromProject(selectedProjectId, taskId)}
          />
        )}
      </div>
    </div>
  )
}

export default App
