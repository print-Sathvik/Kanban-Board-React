import { useEffect, useState } from "react";
import { User } from "./types/userTypes";
import Board from "./components/Board";
import Home from "./components/Home";
import { me } from "./utils/apiUtils";
import { useRoutes } from "raviger";
import Login from "./components/Login";
import AppContainer from "./AppContainer";

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

  const routes = {
    "/": () => <Home currentUser={currentUser} />,
    "/login": () => <Login />,
    "/boards/:id": ({ id }: { id: string }) => <Board id={Number(id)} />,
  };

  let routeResult = useRoutes(routes);
  return <AppContainer currentUser={currentUser}>{routeResult}</AppContainer>;
}
