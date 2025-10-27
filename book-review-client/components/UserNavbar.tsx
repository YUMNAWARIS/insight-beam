"use client";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function UserNavbar() {
  const router = useRouter();
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ib_token");
      localStorage.removeItem("ib_user");
      document.cookie = "ib_auth=; path=/; max-age=0";
    }
    router.push("/login");
  };
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
          <Typography component={Link} href="/explore" sx={{ textDecoration: "none"}}>Explore</Typography>
          <Typography component={Link} href="/books" sx={{ textDecoration: "none"}}>Books</Typography>
          <Typography component={Link} href="/likes" sx={{ textDecoration: "none"}}>Likes</Typography>
          <Typography component={Link} href="/reviews" sx={{ textDecoration: "none"}}>Reviews</Typography>
          <Typography component={Link} href="/profile" sx={{ textDecoration: "none"}}>Profile</Typography>
        </Box>
        <Button onClick={handleLogout} color="inherit" size="small">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}



