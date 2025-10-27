"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function GuestNavbar() {
  return (
    <AppBar
      position="sticky"
      color="default"
      enableColorOnDark
      sx={{
        bgcolor: (t) => (t.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'transparent'),
        backdropFilter: (t) => (t.palette.mode === 'light' ? 'saturate(180%) blur(8px)' : 'none'),
        boxShadow: 0,
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <Typography component={Link} href="/" variant="h6" sx={{ flexGrow: 1, textDecoration: "none"}}>
          Insight Beam
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Typography component={Link} href="/" sx={{ textDecoration: "none"}}>Home</Typography>
          <Typography component={Link} href="/about" sx={{ textDecoration: "none"}}>About</Typography>
          <Typography component={Link} href="/contact" sx={{ textDecoration: "none"}}>Contact Us</Typography>
          <Typography component={Link} href="/login" sx={{ textDecoration: "none"}}>Login</Typography>
          <Typography component={Link} href="/register" sx={{ textDecoration: "none"}}>Register</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}



