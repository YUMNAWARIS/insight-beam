"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: "center", borderTop: 1, borderColor: "divider" }}>
      <Typography variant="body2">© 2025 Insight Beam</Typography>
    </Box>
  );
}


