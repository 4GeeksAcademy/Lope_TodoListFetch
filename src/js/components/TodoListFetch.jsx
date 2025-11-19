import { useEffect, useState } from "react";


export const TodoListFetch = () => {
  const baseURL = 'https://playground.4geeks.com/todo';
  const user = 'spain-123';

  const [ newTask, setNewTask ] = useState('');
  const [ todos, setTodos ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const handleNewTask = event => setNewTask(event.target.value);

  const createUser = async () => {
    try {
      await fetch(`${baseURL}/users/${user}`, {
        method: "POST",
        headers: { "Content-Type": "application/json"}
      });
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  const getTodos = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch(`${baseURL}/users/${user}`);

      if (resp.status === 404) {
        await createUser();
        await getTodos();
        return;
      }

      const data = await resp.json();
      setTodos(data.todos);

    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    } finally {
      setIsLoading (false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    if (newTask.trim() === '') return;

    const taskData = { label: newTask.trim(), is_done: false};

    try {
      const resp = await fetch(`${baseURL}/todos/${user}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData)
      });

      if (resp.ok) {
        setNewTask('');
        await getTodos();
      } else {
        console.error("Fallo al agregar la tarea:", resp.status);
      }

    } catch (error) {
      console.error("Error en el POST:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const resp = await fetch(`${baseURL}/todos/${user}/${taskId}`, {
        method: "DELETE"
      });

      if (resp.ok) {
        await getTodos();
      } else {
        console.error("Fallo al eliminar la tarea individual:", resp.status);
      }

    } catch (error) {
      console.error("Error en el DELETE total:", error);
    }
  };

  const deleteAllTasks = async () => {
    if (!window.confirm("¿Estás seguros de que quieres eliminar TODAS las tareas?")) return;

    try {
      const resp = await fetch(`${baseURL}/users/${user}`, {
        method: "DELETE"
      });

      if (resp.ok) {
        console.log("Usuario y todas las tareas eliminadas.");
        await createUser();
        await getTodos();
      } else {
        console.error("Fallo al eliminar todas lastareas:", resp.status);
      }
    } catch (error) {
      console.error("Error en el DELETE total:", error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
   <div className="container my-5 col-10 col-sm-8 col-md-6 m-auto">
    <h1 className="text-success text-center mb-4">Todo List with Fetch</h1>

   <form onSubmit={addTask}>
    <div className="text-start mb-3">
      <label htmlFor="inputTask" className="form-label">Nueva Tarea</label>
      <div className="input-group">
        <input type="text" className="form-control" id="inputTask" placeholder="¿Qué necesitas hacer?" value={newTask} onChange={handleNewTask} />
        <button className="btn btn-primary" type="submit">Añadir</button>
      </div>
    </div>
   </form>
   
   <div className="text-center mb-4">
    <button className="btn btn-danger btn-sm" onClick={deleteAllTasks}>Eliminar Todas las Tareas</button>
   </div>

   <hr className="my-3" />
   <h2 className="text-primary mt-5">List</h2>

   <ul className="text-start list-group">
    {isLoading && <li className="list-group-item text-center">Cargando tareas...</li>}

    {!isLoading && todos.length === 0 && (
      <li className="list-group-item text-center text-muted">No tienes tareas pendientes, agrega una</li>)}

    {!isLoading && todos.map((item) => (
      <li key={item.id} className="list-group-item d-flex justify-content-between hidden-icon">
        {item.label}
        <span onClick={() => deleteTask(item.id)} role="button">
          <i className="fas fa-trash text-danger"></i>
        </span>
      </li>
    ))}

    {!isLoading && todos.length > 0 && (
      <li className="list-group-item text-end bg-body-tertiary">
        {todos.length} tarea(s) pendiente(s)
      </li>
    )}
   </ul>
  </div>
  )
}
