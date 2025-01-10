import { useState, useEffect } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
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
import { api } from './services/api'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const { user, isLoading, tasks, projects, setTasks, setProjects } = useAuth()

  console.log('App render - tasks:', tasks);
  console.log('App render - projects:', projects);

  // Helper function to create a task with consistent structure
  const createTaskStructure = (name, column = 'Todo', projectId = null) => {
    return {
      name: name,
      column: column,
      isComplete: false,
      previousColumn: column,
      notes: '',
      subTasks: [],
      projectId: projectId,
      userId: user?.sub
    }
  }

  const addTask = async (taskName) => {
    try {
      const taskData = createTaskStructure(taskName);
      const newTask = await api.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success('Task created');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
      return;
    }
  }

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const isCompleting = !task.isComplete;
      const updatedTask = await api.updateTask(taskId, {
        isComplete: isCompleting,
        previousColumn: task.column,
        column: isCompleting ? 'Done' : task.previousColumn
      });

      if (isCompleting) {
        toast.success('Task completed: ' + task.name, {
          icon: '✨',
          style: {
            background: '#28a745',
            color: '#fff'
          }
        });
      }

      setTasks(prevTasks => 
        prevTasks.map(t => t._id === taskId ? updatedTask : t)
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    try {
      const task = tasks.find(t => t._id === draggableId);
      if (!task) return;

      const updatedTask = await api.updateTask(draggableId, {
        column: destination.droppableId,
        previousColumn: destination.droppableId === 'Done' 
          ? source.droppableId 
          : destination.droppableId,
        isComplete: destination.droppableId === 'Done'
      });

      setTasks(prevTasks => 
        prevTasks.map(t => t._id === draggableId ? updatedTask : t)
      );
    } catch (error) {
      console.error('Failed to move task:', error);
      toast.error('Failed to move task');
    }
  }

  const updateTask = async (updatedTask) => {
    try {
      const response = await api.updateTask(updatedTask._id, updatedTask);
      setTasks(prevTasks => 
        prevTasks.map(task => task._id === updatedTask._id ? response : task)
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task');
    }
  }

  const deleteTask = async (taskId) => {
    try {
      console.log('Deleting task:', taskId);
      await api.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      toast.success('Task deleted', {
        icon: '🗑️',
        style: {
          background: '#6c757d',
          color: '#fff'
        }
      });
      setSelectedTask(null);  // Close the task details modal
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  }

  const handleCreateProject = async (projectName) => {
    // Check for duplicate project names
    if (projects.some(p => p.name === projectName)) {
      toast.error('A project with this name already exists');
      return;
    }

    try {
      const newProject = {
        name: projectName,
        notes: '',
        color: '#6c757d',
        userId: user?.sub
      };
      const response = await api.createProject(newProject);
      setProjects(prevProjects => [...prevProjects, response]);
      toast.success(`Project created: ${projectName}`, {
        icon: '📁',
        style: {
          background: '#28a745',
          color: '#fff'
        }
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  }

  const updateProject = async (updatedProject) => {
    try {
      const response = await api.updateProject(updatedProject._id, updatedProject);
      setProjects(prevProjects => 
        prevProjects.map(p => p._id === updatedProject._id ? response : p)
      );
    } catch (error) {
      console.error('Failed to update project:', error);
      toast.error('Failed to update project');
    }
  }

  const addTaskToProject = async (projectId, taskId) => {
    try {
      const project = projects.find(p => p._id === projectId);
      if (!project) return;

      const updatedProject = {
        ...project,
        taskIds: [...project.taskIds, taskId]
      };

      const [updatedProjectRes, updatedTaskRes] = await Promise.all([
        api.updateProject(projectId, updatedProject),
        api.updateTask(taskId, { projectId })
      ]);

      setProjects(prevProjects => 
        prevProjects.map(p => p._id === projectId ? updatedProjectRes : p)
      );
      setTasks(prevTasks => 
        prevTasks.map(t => t._id === taskId ? updatedTaskRes : t)
      );
    } catch (error) {
      console.error('Failed to add task to project:', error);
      toast.error('Failed to add task to project');
    }
  }

  const removeTaskFromProject = async (projectId, taskId) => {
    try {
      const project = projects.find(p => p._id === projectId);
      if (!project) return;

      const updatedProject = {
        ...project,
        taskIds: project.taskIds.filter(id => id !== taskId)
      };

      const [updatedProjectRes, updatedTaskRes] = await Promise.all([
        api.updateProject(projectId, updatedProject),
        api.updateTask(taskId, { projectId: null })
      ]);

      setProjects(prevProjects => 
        prevProjects.map(p => p._id === projectId ? updatedProjectRes : p)
      );
      setTasks(prevTasks => 
        prevTasks.map(t => t._id === taskId ? updatedTaskRes : t)
      );
    } catch (error) {
      console.error('Failed to remove task from project:', error);
      toast.error('Failed to remove task from project');
    }
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
      task._id === updatedTask._id
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
    setTasks(tasks.filter(task => task._id !== taskId))
  }

  const handleSelectProject = (projectId) => {
    console.log('Selecting project:', projectId);
    const project = projects.find(p => p._id === projectId);
    console.log('Found project:', project);
    setSelectedProjectId(projectId);
  };

  const handleDeleteProject = async (projectId, deleteTasks) => {
    try {
      await api.deleteProject(projectId);
      setProjects(prevProjects => 
        prevProjects.filter(p => p._id !== projectId)
      );
      
      if (deleteTasks) {
        // Remove associated tasks if requested
        setTasks(prevTasks => 
          prevTasks.filter(task => task.projectId !== projectId)
        );
      } else {
        // Just remove project association from tasks
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.projectId === projectId 
              ? { ...task, projectId: null }
              : task
          )
        );
      }
      
      toast.success('Project deleted', {
        icon: '🗑️',
        style: {
          background: '#6c757d',
          color: '#fff'
        }
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  useEffect(() => {
    console.log('Tasks state updated:', tasks)
  }, [tasks])

  return (
    isLoading ? (
      <div>Loading...</div>
    ) : !user ? (
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
          onSelectProject={handleSelectProject}
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
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target
                const input = form.elements.taskName
                if (!input.value.trim()) {
                  toast.error('Task name cannot be empty')
                  return
                }
                await addTask(input.value.trim())
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
                project={projects.find(p => p._id === selectedProjectId)}
                tasks={tasks}
                onClose={() => setSelectedProjectId(null)}
                onUpdate={updateProject}
                onAddTask={addTaskToProject}
                onRemoveTask={removeTaskFromProject}
                onCreateTask={createTaskFromProject}
                onDelete={handleDeleteProject}
                className={isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}
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
            onDelete={deleteTask}
            onToggleComplete={handleTaskUpdate}
            onAddToProject={(projectId) => addTaskToProject(projectId, selectedTask._id)}
          />
        )}
      </div>
    )
  )
}

export default App
