import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Home = () => {

  /*Task Schema:
    tasks = [
      { name: string , completed: boolean },
      ...
    ]
  */

  let [tasks, updateTasks] = useState([]);
  let [taskName, setTaskName] = useState("");

  const addTask = (name) => {
    if (name) {
      let curr = tasks;
      let id = `task${tasks.length}`;
      curr.push({ id, name, completed: false })
      updateTasks(curr)
      setTaskName("")
    }
  }

  const handleTaskNameInput = (text) => {
    setTaskName(text)
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      addTask(taskName)
    }
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );

    updateTasks(items)
  }

  let renderedTasks = tasks.map((task, index) => {
    return (
      <Draggable key={task.name} draggableId={task.name} index={index}>
        {(provided) => (
          <div className='task-container' data-priority={index + 1} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <p>{task.name}</p>
            <button className='remove' onClick={() => updateTasks(tasks.filter(t => t.name !== task.name))}>&times;</button>
          </div>
        )}
      </Draggable>
    )
  })

  return (
    <div className='Home' onKeyUp={(e) => handleKeyUp(e)}>
      <div className='task-adder'>
        <input type='text' placeholder='Name' name='task-name' onChange={(e) => handleTaskNameInput(e.target.value)} value={taskName} autoComplete="off" />
        <button className="add-task" onClick={() => addTask(taskName)} >Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' renderClone={(provided) =>
        (
          <div className="task-clone"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <p>{provided.draggableProps["data-rbd-draggable-id"]}</p>
            <button className='remove'>&times;</button>
          </div>
        )
        }>
          {(provided) => (
            <div className='task-list' {...provided.droppableProps} ref={provided.innerRef}>
              {renderedTasks}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Home;