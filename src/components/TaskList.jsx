import { Draggable } from '@hello-pangea/dnd';
import Task from './Task';
import './Task.css';

export default function TaskList({ tasks, onToggleComplete, onSelectTask }) {
  return (
    <>
      {tasks.map((task, index) => (
        <Draggable
          key={task._id}
          draggableId={task._id.toString()}
          index={index}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="task-wrapper"
            >
              <Task
                task={task}
                onToggleComplete={onToggleComplete}
                onSelect={() => onSelectTask(task)}
              />
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
} 