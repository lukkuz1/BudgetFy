import React from "react";
import { Container, Box, Typography } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sveiki atvykę į BudgetFy!
        </Typography>
        <Typography variant="body1">
          Čia galite sekti savo išlaidas, taupyti ir gauti naudingų patarimų.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
