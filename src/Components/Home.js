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
  let [inputs, setInputs] = useState({})

  const addTask = (name) => {
    let exists = false;
    tasks.forEach((t, i) => {
      if(t.name === name){
        exists = true
      }
    })
    if(exists && tasks.length > 0){
      addBurrito(`${name} has already been added!`, "Error")
      setInputs(prev => ({
        ...prev,
        "task-name": ""
      }))
      return
    }
    if(!name){
      addBurrito("Enter a task name first!", "Error")
      return
    }
    if(name){
      let curr = tasks;
      let id = `task${tasks.length}`;
      curr.push({ id, name, completed: false, subtasks: [] })
      updateTasks(curr)
      setInputs(prev => ({
        ...prev,
        "task-name": ""
      }))
    }
  }

  const toggleComplete = (index, completed) => {
    let curr = tasks;
    curr[index].completed = !completed
    updateTasks(curr)
    setInputs(prev => ({
      ...prev,
      "task-name": ""
    }))
  }

  const addSubTask = (taskid, task, taskinput) => {
    let curr = tasks;
    let name = task;
    let completed = false;
    curr.forEach((t,i) => {
      let id = `${taskid}subtask${t.subtasks.length}`;
      if(t.id === taskid){
        let exists = false;
        t.subtasks.forEach((st, i) => {
          if(st.name === name){
            exists = true
          }
        })
        if(exists && t.subtasks.length > 0){
          addBurrito(`${name} has already been added to ${t.name}!`, "Error")
          return
        }
        if(!name){
          addBurrito("Enter a subtask name first!", "Error")
          return
        }
        if(name){
          t.subtasks.push({id, name, completed})
        }
      }
    })
    updateTasks(curr)
    setInputs(prev => ({
      ...prev,
      [`${taskinput}`]: ""
    }))
  }

  const toggleSubCompleted = (index, subIndex, name, completed) => {
    let curr = tasks;
    curr[index].subtasks[subIndex].completed = !completed
    updateTasks(curr)
    setInputs(prev => ({
      ...prev,
      [`${tasks[index].name}`]: ""
    }))
  }
  
  const removeSubTask = (index, name) => {
    let curr = tasks
    let updated = curr[index].subtasks.filter(sub => sub.name !== name)
    curr[index].subtasks = updated
    updateTasks(curr)
    setInputs(prev => ({
      ...prev,
      [`${tasks[index].name}`]: ""
    }))
  }

  window.onscroll = function() {scrollFunction()};

  const scrollFunction = () => {
    if (document.body.scrollTop > 32 || document.documentElement.scrollTop > 32) {
      document.getElementById("task-adder").classList.add("full-width-adder");
    } else {
      document.getElementById("task-adder").classList.remove("full-width-adder");
    }
  }

  const handleInput = (name, text) => {
    setInputs(prev => (
      {...prev, [name]: text}
      ))
  }

  const toggleAccordion = (id) => {
    let elmnt = document.getElementById(id);
    if(elmnt.style.height === "250px"){
      elmnt.style.height = "56px"
    } else {
      elmnt.style.height = "250px"
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      addTask(inputs["task-name"])
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

  // const removeBurrito = (id) => {
  //   let curr = burrito;
  //   let newBurr = curr.shift()
  //   updateBurrito(newBurr)
  // }

  const addBurrito = (burr, burrtype) => {
    let burritos = document.getElementById('burritos')
    let burro = document.createElement("div")
    let error = document.createElement("p")
    let name = document.createElement("p")
    burro.className = "burrito"
    error.innerHTML = `${burrtype}`
    name.innerHTML = `${burr}`

    burro.appendChild(error)
    burro.appendChild(name)
    burritos.appendChild(burro)

    setTimeout(()=> {
      burro.remove()
    }, 3000)


    // let curr = [] || burrito;
    // let id = `burr${curr.length}`
    // curr.push({id, burr, burrtype})
    // updateBurrito(curr)
  }

  const calculateCompletion = (task) => {
    if(task.completed){
      return "100"
    }
    if(task.subtasks.length > 0){
      let comp = 0;
      task.subtasks.forEach(st => {
        if(st.completed){
          comp++
        }
      })
      return Math.floor((comp/task.subtasks.length)*100)
    }
    else{
      return "0"
    }
  }


  let renderedTasks = tasks.map((task, index) => {
    let percent = calculateCompletion(task);
    return (
      <Draggable key={`${task.name}${index}`} draggableId={`${task.name}${index}`} index={index}>
        {(provided) => {
          return (
            <div className='task-container' id={'task-container-' + task.name} data-priority={index + 1} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <div className='task-top'>
                <div className="task-number">{index + 1}</div>
                <div className="task-info" id={'task-class-' + task.name}>
                  <p className='checkbox' style={{ textDecoration: "none" }}></p>
                  <p>{task.name}</p>
                  <div className='film' onClick={() => {
                    document.getElementById(`task-container-${task.name}`).classList.toggle('line-through')
                    toggleComplete(index, task.completed)
                  }}></div>
                </div>
                <div className='task-operations'>
                  <p className="percent" style={{ textDecoration: "none" }}>{task.completed ? "100" : percent}% Done</p>
                  <button className='add-sub-task' onClick={() => toggleAccordion('task-container-' + task.name)}><i className="fas fa-tasks"></i></button>
                  <button className='remove' onClick={() => updateTasks(tasks.filter(t => t.name !== task.name))}>&times;</button>
                </div>
              </div>
              <div className='sub-task-adder'>
                <input type='text' placeholder='Subtask Name...' name={`${task.name}`} onChange={(e) => handleInput(e.target.name, e.target.value)} value={inputs[`${task.name}`] || ""} autoComplete="off" />
                <button className="add-task" onClick={() => addSubTask(task.id, inputs[`${task.name}`], `${task.name}`)} >Add Subtask</button>
              </div>
              <div className="sub-tasks">
                {task.subtasks.map((st, i) => {
                  let completedClass = ""
                  if(st.completed){
                    completedClass = "line-through"
                  }
                  return(
                    <div key={i} className={`sub-task ${completedClass}`} id={`sub-task-${st.name}`}>
                      <div className='sub-task'>
                      <p className='checkbox' style={{ textDecoration: "none" }}></p>
                      <p>{st.name}</p>
                      <div className='film' onClick={(e) => {
                        document.getElementById(`sub-task-${st.name}`).classList.toggle('line-through')
                        toggleSubCompleted(index, i, st.name, st.completed)
                      }}></div>
                      </div>
                      <button className='remove' onClick={(e) => {
                        removeSubTask(index, st.name)
                      }}>&times;</button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        }}
      </Draggable>
    )
  })


  return (
    <div className='Home' onKeyUp={(e) => handleKeyUp(e)}>
      <div className='task-adder' id='task-adder'>
        <input type='text' placeholder='Task Name...' name='task-name' onChange={(e) => handleInput(e.target.name, e.target.value)} value={inputs["task-name"] || ""} autoComplete="off" />
        <button className="add-task" name='task-name' onClick={(e) => addTask(inputs[`${e.target.name}`])} >Add Task</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' renderClone={(provided) =>
        (
          <div className="task-clone"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <div className="task-info">
              <p className='checkbox' style={{ textDecoration: "none" }}></p>
              <p>{provided.draggableProps["data-rbd-draggable-id"]}</p>
              <div className='film'></div>
            </div>
            <div className='task-operations'>
              <button className='remove'>&times;</button>
            </div>
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
      <div className="burritos" id="burritos">
      </div>
    </div>
  )
}

export default Home;