import { FC, useState } from "react";

export interface TodoFormProps {
  onAdd: (text: string) => void;
}

const TodoForm: FC<TodoFormProps> = ({ onAdd }) => {
  const [input, setInput] = useState(0);

  const handleSubmit = (e) => {
    onAdd(input);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={input}
        onChange={setInput(e.target.value)}
        placeholder="Add a new todo"
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default TodoForm;
