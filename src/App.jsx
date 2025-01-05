import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Toaster, toast } from 'react-hot-toast'
import './App.css'
import TaskBoard from './components/TaskBoard'
import AddTaskForm from './components/AddTaskForm'
import ProjectSidebar from './components/ProjectSidebar'
import ProjectDetails from './components/ProjectDetails'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import ProfileMenu from './components/ProfileMenu'
import TaskDetails from './components/TaskDetails'

function App() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const { user } = useAuth()

  // Helper function to create a task with consistent structure
  const createTaskStructure = (name, column = 'Todo', projectId = null) => {
    return {
      id: Date.now().toString(),
      name: name,
      column: column,
      isComplete: false,
      previousColumn: column,
      notes: '',
      subTasks: [],
      projectIds: projectId ? [projectId] : []
    }
  }

  const addTask = (taskName) => {
    const newTask = createTaskStructure(taskName)
    setTasks([...tasks, newTask])
  }

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.isComplete;
        
        // Show completion toast
        if (isCompleting) {
          toast.success('Task completed: ' + task.name, {
            icon: '✨',
            style: {
              background: '#28a745',
              color: '#fff'
            }
          });
        }
        
        return {
          ...task,
          isComplete: isCompleting,
          previousColumn: task.column,
          column: isCompleting ? 'Done' : task.previousColumn
        };
      }
      return task;
    }));
  };

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

  const handleCreateProject = (projectName) => {
    // Check for duplicate project names
    if (projects.some(p => p.name === projectName)) {
      toast.error('A project with this name already exists')
      return
    }

    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      taskIds: [],
      notes: '',
      color: '#6c757d'
    }
    setProjects([...projects, newProject])
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

  const createTaskFromProject = (taskName, column, projectId) => {
    console.log('Creating task:', { taskName, column, projectId })
    
    // Create the new task
    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      column: column,
      isComplete: false,
      previousColumn: column,
      notes: '',
      subTasks: [],
      projectIds: [projectId]
    }
    
    // Update tasks state
    setTasks(currentTasks => [...currentTasks, newTask])
    
    // Update projects state to include the new task
    setProjects(currentProjects => 
      currentProjects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            taskIds: [...p.taskIds, newTask.id]
          }
        }
        return p
      })
    )

    return newTask.id
  }

  const handleDeleteTask = (taskId) => {
    // First, get the task details before deletion
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    // Remove task from all projects
    const updatedProjects = projects.map(project => ({
      ...project,
      taskIds: project.taskIds.filter(id => id !== taskId)
    }));
    setProjects(updatedProjects);

    // Remove the task
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    // Show deletion toast after task is deleted
    toast('Task removed: ' + taskToDelete.name, {
      icon: '🗑️',
      style: {
        background: '#6c757d',
        color: '#fff'
      }
    });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task)
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id 
        ? {
            ...task,
            ...updatedTask,
            subTasks: updatedTask.subTasks || [],  // Ensure subTasks is always an array
            notes: updatedTask.notes || '',        // Ensure notes is always a string
            isComplete: updatedTask.isComplete     // Update completion status
          }
        : task
    ))
  }

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  useEffect(() => {
    console.log('Tasks state updated:', tasks)
  }, [tasks])

  return (
    !user ? (
      <Login />
    ) : (
      <div className="app-container">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        >
          {isSidebarExpanded ? '✕' : '☰'}
        </button>
        {isSidebarExpanded && (
          <div 
            className="sidebar-overlay visible"
            onClick={() => setIsSidebarExpanded(false)}
          />
        )}
        <ProjectSidebar
          projects={projects}
          onCreateProject={handleCreateProject}
          onSelectProject={setSelectedProjectId}
          selectedProjectId={selectedProjectId}
          isExpanded={isSidebarExpanded}
          onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
        <div className={`main-wrapper ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
          <div className="app-header" data-testid="app-header">
            <h1>Raviflo</h1>
            <form 
              className="header-task-form"
              data-testid="header-task-form"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target
                const input = form.elements.taskName
                if (!input.value.trim()) {
                  toast.error('Task name cannot be empty')
                  return
                }
                addTask(input.value.trim())
                toast.success('Task created')
                form.reset()
              }}
            >
              <input
                name="taskName"
                type="text"
                placeholder="New task..."
                className="header-task-input"
              />
              <button type="submit">Create</button>
            </form>
            <ProfileMenu />
          </div>
          <div className="main-content">
            <DragDropContext onDragEnd={handleDragEnd}>
              <TaskBoard 
                tasks={tasks}
                projects={projects}
                onToggleComplete={toggleComplete}
                onTaskClick={handleTaskClick}
                onDeleteTask={handleDeleteTask}
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
                onCreateTask={(name, column) => createTaskFromProject(name, column, selectedProjectId)}
              />
            )}
          </div>
        </div>
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            projects={projects}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleTaskUpdate}
            onDelete={handleTaskDelete}
            onToggleComplete={handleTaskUpdate}
            onAddToProject={(projectId) => addTaskToProject(projectId, selectedTask.id)}
          />
        )}
      </div>
    )
  )
}

export default App
