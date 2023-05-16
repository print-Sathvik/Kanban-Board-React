import { navigate } from "raviger";
import { User } from "./types/userTypes";
import Header from "./components/Header";

export default function AppContainer(props: {
  currentUser: User | null;
  children: React.ReactNode;
}) {
  if (props.currentUser && props.currentUser.username.length === 0)
    navigate("/login");
    
  return (
    <div className="h-screen bg-gray-100">
      <Header currentUser={props.currentUser} />
      {props.currentUser ? (
        props.children
      ) : (
        <p className="p-5 text-lg">Loading....</p>
      )}
    </div>
  );
}
