import { useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import TodoFilter from "./components/TodoFilter";
import { Todo } from "./types/todo.types";
import { Filter } from "./types/filter.types";
import { generateNanoId } from "./utils/id.util";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const addTodo = (text: string) => {
    todos.push({ id: generateNanoId(), text, completed: false });
    setTodos(todos);
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id == id) {
        todo.completed = !todo.completed;
        return todo;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const remainingTodos = todos.filter((todo) => {
      return todo.id !== id;
    });
    setTodos(remainingTodos);
  };

  const filteredTodos = () => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  };

  function clearCompleted() {
    const activeTodos = todos.filter((todo) => !todo.completed);
    setTodos(activeTodos);
  }

  return (
    <div className="app">
      <h1>Todo App</h1>

      <TodoForm onAdd={addTodo} />

      <TodoList
        todos={filteredTodos()}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />

      <TodoFilter
        filter={filter}
        onFilter={setFilter}
        onClearCompleted={clearCompleted}
      />
    </div>
  );
};

export default App;
