import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editTaskId, setEditTaskId] = useState("");

 const fetchTodosFromLocalStorage = () => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    try {
      const parsedTasks = JSON.parse(storedTasks);
      setTasks(parsedTasks);
    } catch (error) {
      console.error('Error parsing stored tasks:', error);
    
      setTasks([]);
      }
    }
  };


    useEffect(() => {
      if (!navigator.onLine) {
        // Handle offline scenario
        console.log('You are offline!');
      }
    }, []);


    useEffect(() => {
      fetchTodosFromLocalStorage();
    }, []);

  const updateLocalStorageAndSetTasks = (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    setTasks(newTasks);
    };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    };

  const handleAddTask = () => {
    if (inputValue.trim() === '') {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: inputValue,
      completed: false,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setInputValue('');
    updateLocalStorageAndSetTasks([newTask, ...tasks]);
    toast.success('Task added successfully');
    };
  
  const handleTaskCheckboxChange = (taskId) => {
    console.log('Checkbox clicked for task ID:', taskId);
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    const completedTask = updatedTasks.find((task) => task.id === taskId && task.completed);
    if (completedTask) {
      updatedTasks.splice(updatedTasks.indexOf(completedTask), 1);
      updatedTasks.push(completedTask);
    }
    setTasks(updatedTasks);
    updateLocalStorageAndSetTasks(updatedTasks);
  };
  
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    updateLocalStorageAndSetTasks(updatedTasks);
    toast.success('Task deleted successfully');
  };
  // Function to edit a task
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId);
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title);
  };
  // Function to update a task
  const handleUpdateTask = () => {
    if (inputValue.trim() === '') {
      updateLocalStorageAndSetTasks(tasks);
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editTaskId ? { ...task, title: inputValue } : task
      )
    );
    setInputValue('');
    setEditTaskId(null);
    toast.success('Task updated successfully');
  };

  // Function to mark all tasks as completed
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
    updateLocalStorageAndSetTasks((prevTasks) =>
    prevTasks.map((task) => ({ ...task, completed: true }))
  );
  };

  // Function to clear completed tasks
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    updateLocalStorageAndSetTasks((prevTasks) =>
    prevTasks.filter((task) => !task.completed)
  );
  };
  // Function to handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType);
  };
  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'uncompleted') {
      return !task.completed;
    }
    return true;
  });
  const handleReset = () => {
    // Clear all TODOs
    setTasks([]);
    // Reset other states if needed
    setInputValue('');
    setEditTaskId(null);
    setFilter('all');
    // Update local storage
    localStorage.removeItem('tasks');
    toast.success('Reset successfully');
  };
  
  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
      <header className="header">
          <h2>Todo List</h2>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          </header>
        <hr/>
        <br/>
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus 
            value={inputValue} 
            onChange={handleInputChange} 
          />
          <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddTask}>
            {editTaskId ? 'Update' : 'Add'}
          </button>
        </div>
        
        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>


        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
                
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>
        <hr/>
        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange('all')}>
                All
              </a>
              <a href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}>
                Uncompleted
              </a>
              <a href="#" id="com" onClick={() => handleFilterChange('completed')}>
                Completed
              </a>
            </div>
          </div>

          <div className="completed-task">
            <p>
              Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TodoList;