import { FC } from "react";
import { Filter } from "../types/filter.types";

export interface TodoFilterProps {
  filter: Filter;
  onFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
}

const TodoFilter: FC<TodoFilterProps> = ({
  filter,
  onFilter,
  onClearCompleted,
}) => {
  const handleFilterChange = (newFilter: Filter) => {
    onFilter(newFilter);
  };

  const getActiveClass = (buttonFilter: Filter) => {
    return filter === buttonFilter ? "active" : "";
  };

  return (
    <div className="todo-filter">
      <div className="filter-buttons">
        <button
          className={getActiveClass("all")}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button
          className={getActiveClass("active")}
          onClick={() => handleFilterChange("active")}
        >
          Active
        </button>
        <button
          className={getActiveClass("completed")}
          onClick={() => handleFilterChange("completed")}
        >
          Completed
        </button>
      </div>

      <button className="clear-completed" onClick={() => onClearCompleted()}>
        Clear completed
      </button>
    </div>
  );
};
export default TodoFilter;
