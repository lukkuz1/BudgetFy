import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const status = await auth.signUp(email, password);
    if (typeof status === "string") {
      setError(status);
    } else if (status) {
      alert("Verifikacijos nuoroda išsiųsta. Patvirtinkite savo el. paštą!");
      navigate("/login");
    } else {
      setError("Įvyko nežinoma klaida.");
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
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Registracija
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="El. paštas"
          placeholder="pavyzdys@gmail.com"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Slaptažodis"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSignUp}
          sx={{ mt: 2 }}
        >
          Registruotis
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Jau turite paskyrą?{" "}
          <Box
            component="span"
            sx={{ color: "primary.main", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Prisijungti!
          </Box>
        </Typography>
      </Box>
    </Container>
  );
}