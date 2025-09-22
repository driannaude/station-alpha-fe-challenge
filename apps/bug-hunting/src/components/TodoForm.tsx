import { ChangeEvent, FC, FormEvent, useState } from "react";

export interface TodoFormProps {
  onAdd: (text: string) => void;
}

const TodoForm: FC<TodoFormProps> = ({ onAdd }) => {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Prevent form from refreshing the page
    e.preventDefault();

    const trimmedInput = input.trim();

    // Validate input to make sure we don't have an empty one.
    if (!trimmedInput) {
      setError("Please enter a todo item");
      return;
    }

    // Clear any previous error and input
    setError("");
    setInput("");
    onAdd(trimmedInput);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Fall back to empty string if e.target.value is null or undefined
    // so we don't have uncontrolled to controlled input behaviour
    const value = e.target.value ?? "";
    setInput(value);

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className="todo-form-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Add a new todo"
          className={error ? "error" : ""}
        />
        <button type="submit">Add Todo</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TodoForm;
