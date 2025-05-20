import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("🔑 Login render:");
  console.log(" • at path:", location.pathname);
  console.log(" • email:", email);
  console.log(" • password length:", password.length);
  console.log(" • rememberMe:", rememberMe);

  const handleLogin = async () => {
    console.log("👉 handleLogin called with", { email, password });
    setError("");
    try {
      await auth.signIn(email, password);
      console.log("✅ signIn success, navigating to /");
      navigate("/");
    } catch (err: any) {
      console.error("❌ signIn error:", err);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Neteisingas el. paštas.");
          break;
        case "auth/user-not-found":
          setError("Vartotojas su tokiu el. pašto adresu nerastas.");
          break;
        case "auth/wrong-password":
          setError("Neteisingas slaptažodis.");
          break;
        default:
          setError(err.message || "Įvyko nežinoma klaida.");
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        sx={{
          mt: 8,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Prisijungimas
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
          onChange={(e) => {
            console.log("✏️ email change:", e.target.value);
            setEmail(e.target.value);
          }}
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
          onChange={(e) => {
            console.log("✏️ password change:", e.target.value.length, "chars");
            setPassword(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => {
                    console.log("👁️ toggle showPassword", !showPassword);
                    setShowPassword((s) => !s);
                  }}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => {
                console.log("✔️ rememberMe change:", e.target.checked);
                setRememberMe(e.target.checked);
              }}
            />
          }
          label="Prisiminti mane"
          sx={{ mt: 1 }}
        />

        <Button
          fullWidth
          variant="text"
          onClick={() => {
            console.log("🔗 navigate to /change-password");
            navigate("/change-password");
          }}
          sx={{ mt: 1, mb: 2 }}
        >
          Pamiršote slaptažodį?
        </Button>

        <Button fullWidth variant="contained" type="submit" sx={{ mt: 0 }}>
          Prisijungti
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Neturite paskyros?{" "}
          <Box
            component="span"
            sx={{ color: "primary.main", cursor: "pointer" }}
            onClick={() => {
              console.log("🔗 navigate to /register");
              navigate("/register");
            }}
          >
            Registruotis
          </Box>
        </Typography>
      </Box>
    </Container>
  );
}