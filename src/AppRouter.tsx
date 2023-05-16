import React, { useEffect, useState } from "react";
import { User } from "./types/userTypes";
import Board from "./components/Board";
import Home from "./components/Home";
import { me } from "./utils/apiUtils";
import { useRoutes } from "raviger";
import AppContainer from "./AppContainer";

const Login = React.lazy(() => import("./components/Login"));
const TodoList = React.lazy(() => import("./components/TodoList"));

const getCurrentUser: (
  setCurrentUser: (currentUser: User) => void
) => void = async (setCurrentUser) => {
  const currentUser = await me();
  setCurrentUser(currentUser);
};

export default function AppRouter() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);

  //Not using lazy load for home and board beacuse those are primary
  //pages of the site and I want them to be received initially
  const routes = {
    "/": () => <Home currentUser={currentUser} />,
    "/login": () => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <Login />
      </React.Suspense>
    ),
    "/boards/:id": ({ id }: { id: string }) => <Board id={Number(id)} />,
    "/todo": () => (
      <React.Suspense fallback={<div>Loading ...</div>}>
        <TodoList />
      </React.Suspense>
    ),
  };

  let routeResult = useRoutes(routes);
  return <AppContainer currentUser={currentUser}>{routeResult}</AppContainer>;
}
