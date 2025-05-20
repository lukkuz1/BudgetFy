import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      if (!email.trim()) {
        setError("Prašome įvesti teisingą el. paštą.");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setError("");
      alert("Slaptažodžio priminimo nuoroda išsiųsta į jūsų el. paštą.");
      navigate("/login");
    } catch (err: any) {
      const code = err.code;
      if (code === "auth/invalid-email") {
        setError("Neteisingas el. paštas. Prašome įvesti teisingą el. paštą.");
      } else if (code === "auth/user-not-found") {
        setError("Šis el. paštas nesusijęs su jokiu paskyros.");
      } else {
        setError("Nepavyko atlikti slaptažodžio priminimo: " + err.message);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="primary" gutterBottom>
          Slaptažodžio priminimas
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="El. paštas"
          placeholder="pavyzdys@gmail.com"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleForgotPassword}
        >
          Priminti slaptažodį
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
          onClick={() => navigate("/register")}
        >
          Neturite paskyros? Pradėkite jau šiandien!
        </Typography>
      </Box>
    </Container>
  );
}