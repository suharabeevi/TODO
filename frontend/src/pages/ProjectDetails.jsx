import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [newTodo, setNewTodo] = useState("");

  // Fetch project details and todos
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`); // Using the Axios instance
        console.log(response);
        
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProject();
  }, [id]);

  // Handle adding a new todo
  const handleAddTodo = async () => {
    if (newTodo) {
      try {
        const response = await api.post(`todos/addtodo/${id}`, {
          description: newTodo,
          status: false,
        });
        setProject((prevProject) => ({
          ...prevProject,
          todos: [...prevProject.todos, response.data],
        }));
        setNewTodo(""); // Clear input field
      } catch (error) {
        console.error("Error adding new todo:", error);
      }
    }
  };

  // Handle toggling todo status
  const handleToggleStatus = async (todoId) => {
    const todoToUpdate = project.todos.find((todo) => todo._id === todoId);
    const updatedTodo = { ...todoToUpdate, status: !todoToUpdate.status };

    try {
      await api.patch(`/todos/${todoId}`, updatedTodo); // PATCH request to update todo status
      setProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.map((todo) =>
          todo._id === todoId ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  // Handle editing a todo
  const handleEditTodo = async (todoId, newDescription) => {
    const updatedTodo = { ...project.todos.find((todo) => todo._id === todoId), description: newDescription };

    try {
      await api.patch(`/todos/${todoId}`, updatedTodo); // PATCH request to update todo
      setProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.map((todo) =>
          todo._id === todoId ? updatedTodo : todo
        ),
      }));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (todoId) => {
    try {
      await api.delete(`/todos/${todoId}`); // DELETE request to remove todo
      setProject((prevProject) => ({
        ...prevProject,
        todos: prevProject.todos.filter((todo) => todo._id !== todoId),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-details">
      <h2>{project.title}</h2>
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <div className="todo-list">
        <h3>Todos</h3>
        <ul>
          {project.todos.map((todo) => (
            <li key={todo._id}>
              <div className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.status}
                  onChange={() => handleToggleStatus(todo._id)}
                />
                <span className={todo.status ? "completed" : ""}>
                  {todo.description}
                </span>
                <button
                  onClick={() =>
                    handleEditTodo(
                      todo._id,
                      prompt("Edit Todo:", todo.description)
                    )
                  }
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectDetails;
