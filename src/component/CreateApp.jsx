import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateApp = ({ open, onClose, addApp }) => {
  const [appName, setAppName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "${API_BASE_URL}/applications/create",
        { name: appName }
      );
      addApp(response.data);
      setAppName("");
      onClose();
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Application</DialogTitle>
      <DialogContent>
        <Container>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Application Name"
              fullWidth
              required
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#d32f2f", color: "white" }} 
            >
              Create
            </Button>
          </form>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose} color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateApp;
