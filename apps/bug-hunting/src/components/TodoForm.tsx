import { ChangeEvent, FC, FormEvent, useState } from "react";

export interface TodoFormProps {
  onAdd: (text: string) => void;
}

const TodoForm: FC<TodoFormProps> = ({ onAdd }) => {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Prevent form from refreshing the page
    e.preventDefault();
    onAdd(input);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Fall back to empty string if e.target.value is null or undefined so we don't
    // Have uncontrolled to controlled input behaviour
    const value = e.target.value ?? "";
    setInput(value);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Add a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
