import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.post(
          '${API_BASE_URL}/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();

      } catch (error) {
        console.error("Logout Error:", error);
      }
    } else {
      console.log("Token not found");
    }
  };

  return (
 
    <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon sx={{ marginRight: 1, width: 40, height: 40 }} color="inherit" />
            </Button>
  );
};

export default LogoutButton;
