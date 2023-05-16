import React, { useState } from "react";
import { FormPost, Errors, validateForm } from "../../types/boardTypes";
import { TodoPost } from "../../types/actionTypes";

export default function CreateTodo(props: {
  handleSubmit: (board: TodoPost) => void;
  closeCB: () => void;
}) {
  const [board, setBoard] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [errors, setErrors] = useState<Errors<FormPost>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(board);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      props.handleSubmit(board);
    }
  };

  return (
    <div className="w-full max-w-lg divide-y divide-gray-200">
      <h1 className="text-2xl my-2 text-gray-700">Create ToDo</h1>
      <form className="py-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className={`${errors.title ? "text-red-500" : ""}`}
          >
            Title
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="title"
            id="title"
            value={board.title}
            onChange={(e) => {
              setBoard({ ...board, title: e.target.value });
            }}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Description
          </label>
          <input
            type="text"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="description"
            id="description"
            value={board.description ?? ""}
            onChange={(e) => {
              setBoard({ ...board, description: e.target.value });
            }}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="dueDate"
            className={`${errors.description ? "text-red-500" : ""}`}
          >
            Due Date
          </label>
          <input
            type="date"
            className="w-full border-2 border-gray-200 rounded p-2 my-2 flex-1"
            name="dueDate"
            id="dueDate"
            value={board.dueDate}
            required={true}
            onChange={(e) => {
              setBoard({ ...board, dueDate: e.target.value });
            }}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={props.closeCB}
        >
          Create
        </button>
        <button
          type="button"
          onClick={props.closeCB}
          className="m-3 inline-flex float-right w-full justify-center rounded bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
