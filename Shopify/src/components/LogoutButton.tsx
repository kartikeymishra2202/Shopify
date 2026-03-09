import { useAuth } from "../context/auth/authContext";
import { Analytics } from "../lib/mixpanel";


const LogoutButton = () => {
  const { dispatch } = useAuth();

  const logout = () => {
    
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  // Clear Mixpanel identity so the next person 
    // starting a session is treated as a new anonymous user
    Analytics.reset();

  dispatch({ type: "LOGOUT" });
  };

  return <button className=" text-red-500 " onClick={logout}>Logout</button>;
};

export default LogoutButton;
