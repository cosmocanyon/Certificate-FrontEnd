import {
  Card,
  CardContent,
  Typography,
  Grid2,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AppListAdmin = () => {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const fetchApps = async () => {
    try {
      const response = await axios.get(
        'http://k8s-appgroup-60553c07aa-906982441.us-east-1.elb.amazonaws.com/applications/findAll-name'
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setApps(response.data);
    } catch (error) {
      console.error(
        "Error fetching applications:",
        error.response ? error.response.data : error.message
      );
      setError("Unable to fetch applications. Please try again later.");
    }
  };

  const handleNavigate = (appId) => {
    console.log("Navigating to certificates for app ID:", appId);
    navigate(`/certificate/${appId}`);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <Grid2
      container
      spacing={2}
      justifyContent="center"
      mt={2}
      alignItems="center"
      style={{ minHeight: "50vh" }}
    >
      {error && (
        <Grid2 item xs={12}>
          <Alert severity="error">{error}</Alert>
        </Grid2>
      )}
      {apps.map((app) => (
        <Grid2 item xs={12} sm={4} key={app.id}>
          <Card
            onClick={() => handleNavigate(app.id)} 
            sx={{
              border: "2px solid #d32f2f",
              borderRadius: "8px",
              height: "250px",
              width: "200px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease, background-color 0.3s ease",
              cursor: "pointer", 
              "&:hover": {
                backgroundColor: "#FBE9E7",
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <img
                src={logo}
                alt="Logo dell'app"
                style={{
                  width: 120,
                  height: 100,
                  display: "block",
                  margin: "0 auto 8px",
                }}
              />
              <Typography variant="h5" component="div" align="center">
                {app.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default AppListAdmin;

