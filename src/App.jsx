import { useState, useEffect } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Toaster, toast } from 'react-hot-toast'
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

  const createProject = (projectName) => {
    const newProject = {
      id: Date.now().toString(),
      name: projectName,
      taskIds: [],
      notes: '',
      color: '#6c757d', // Default color
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

  useEffect(() => {
    console.log('Tasks state updated:', tasks)
  }, [tasks])

  return (
    <div className="app-container">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }
        }}
      />
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
  )
}

export default App
