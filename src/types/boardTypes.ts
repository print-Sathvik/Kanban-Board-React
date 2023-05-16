type BoardState = {
  id: number;
  title: string;
  description: string;
  created_date?: string;
  modified_date?: string;
  stages: StageType[];
};

type Board = Omit<BoardState, "stages">;

type FormPost = {
  title: string;
  description: string;
};

type TaskPost = {
  title: string;
  description: string;
  status: number;
};

type StageType = {
  id: number;
  title: string;
  description: string;
  boardId?: number;
  created_date?: string;
  modified_date?: string;
};

type Errors<T> = Partial<Record<keyof T, string>>;

export const validateForm = (form: FormPost) => {
  const errors: Errors<FormPost> = {};
  if (form.title.length < 1) {
    errors.title = "Title is Required";
  }
  if (form.title.length > 100) {
    errors.title = "Title must be shorter than 100 characters";
  }
  return errors;
};

type TaskType = {
  id: number;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  colors?: string[];
  status: number;
  board?: number;
  board_object?: Board;
  status_object?: StageType;
  created_date?: string;
  modified_date?: string;
};

export type {
  BoardState,
  Board,
  StageType,
  FormPost,
  TaskPost,
  Errors,
  TaskType,
};
