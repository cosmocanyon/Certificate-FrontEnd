import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Table,
  Box,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import axios from "axios";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";
import BackButton from "./BackButton"; // Assuming you have a back button component
import pageBackground from "../images/pageGeneral.png"; // Assuming same background image is used
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import logo from "../images/certy-timeter.png"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CertificatesListUser = () => {
  const { id } = useParams();
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState(null);
  const [openRenewDialog, setOpenRenewDialog] = useState(false);
  const [daysToAdd, setDaysToAdd] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const fetchCertificates = async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/applications/id/${id}/certificates`
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching certificates:",
        error.response ? error.response.data : error.message
      );
      throw new Error("Unable to fetch certificates");
    }
  };

  useEffect(() => {
    const getCertificates = async () => {
      if (!id) {
        setError("No ID provided for the application.");
        return;
      }
      try {
        const data = await fetchCertificates(id);
        const certificatesWithId = data.map((cert, index) => ({
          ...cert,
          id: cert.id || `cert-${index}`,
        }));

        if (!Array.isArray(certificatesWithId) || certificatesWithId.length === 0) {
          setError("No certificates found.");
          return;
        }
        setCertificates(certificatesWithId);
      } catch (error) {
        setError("Unable to fetch certificates. Please try again later.");
      }
    };

    getCertificates();
  }, [id]);

  const handleDownloadCertificate = (certId) => {
    const url = `${API_BASE_URL}/certificates/${certId}/download`;
    window.open(url, "_blank");
  };

  const handleDownloadPrivateKey = (certId) => {
    const url = `${API_BASE_URL}/certificates/${certId}/private-key/download`;
    window.open(url, "_blank");
  };

  const handleOpenRenewDialog = (certificate) => {
    setSelectedCertificate(certificate);
    setOpenRenewDialog(true);
  };

  const handleCloseRenewDialog = () => {
    setOpenRenewDialog(false);
  };

  const handleRenewCertificate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/certificates/${selectedCertificate.id}/renew`, { days: daysToAdd });
      setSnackbarMessage(response.data.message || "Certificate renewed successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error renewing certificate:", error);
      setSnackbarMessage("Error renewing certificate. Please try again later.");
      setSnackbarOpen(true);
    } finally {
      handleCloseRenewDialog();
    }
  };

  const isCertificateValid = (validFrom, validUntil) => {
    const now = new Date();
    return new Date(validFrom) <= now && new Date(validUntil) >= now;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "fixed",
        height: "100vh",
        width: "100%",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <AppBar position="fixed" sx={{ backgroundColor: "#d32f2f" }}>
        <Toolbar>
        <Box
            component="img"
            src={logo} 
            alt="Logo"
            sx={{
              height: 50, 
              marginRight: 2,
            }}
          />
          <IconButton color="inherit" component={Link} to="/user-home">
            <HomeIcon sx={{ marginRight: 1 }} color="inherit" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Certificates Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper
        sx={{
          mt: 7,
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0)",
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : certificates.length > 0 ? (
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 150px)",
              "&::-webkit-scrollbar": {
                width: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#FBE9E7",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#d32f2f",
                border: "2px solid #FBE9E7",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#b71c1c",
              },
            }}
          >
            <Table
              sx={{
                border: "2px solid #d32f2f",
                "& thead th": {
                  backgroundColor: "#d32f2f",
                  color: "white",
                  fontWeight: "bold",
                },
                "& tbody tr": {
                  background: "rgba(255, 255, 255, 0.8)",
                },
              }}
              stickyHeader
            >
              <TableHead>
                <TableRow align="center">
                  <TableCell>
                    <Typography variant="h6">Subject</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Valid From</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Valid Until</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Status</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Actions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>{certificate.subject}</TableCell>
                    <TableCell>
                      {new Date(certificate.validFrom).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(certificate.validUntil).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isCertificateValid(certificate.validFrom, certificate.validUntil) ? (
                        <CheckCircleIcon sx={{ color: "green" }} />
                      ) : (
                        <CancelIcon sx={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownloadCertificate(certificate.id)}
                        sx={{ ml: 1 }}
                      >
                        <DownloadIcon sx={{ marginRight: 0.5 }} />
                        Crt
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownloadPrivateKey(certificate.id)}
                        sx={{ ml: 1 }}
                      >
                        <DownloadIcon sx={{ marginRight: 0.5 }} />
                        PrivateKey
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenRenewDialog(certificate)}
                        sx={{ ml: 1 }}
                      >
                        <RefreshIcon sx={{ marginRight: 1 }} />
                        Renew
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No certificates available.</Alert>
        )}

        <Dialog open={openRenewDialog} onClose={handleCloseRenewDialog} maxWidth="md">
          <DialogTitle>Renew Certificate</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Days"
                type="number"
                value={daysToAdd}
                onChange={(e) => setDaysToAdd(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRenewDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRenewCertificate} variant="contained" sx={{ ml: 1, backgroundColor: '#00e676', '&:hover': { backgroundColor: 'darkgreen' } }}>
              Renew
            </Button>
          </DialogActions>
        </Dialog>

        <BackButton />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default CertificatesListUser;
