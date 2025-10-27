"use client";
import Link from "next/link";
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: "65dvh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <Stack spacing={3}>
          <Typography variant="h2" fontWeight={800}>
            Welcome to Insight Beam
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 800, mx: "auto" }}>
            Discover insights, share and recommend books, and grow your knowledge.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
            <Button component={Link} href="/about">About Us</Button>
            <Button component={Link} href="/login">Login</Button>
            <Button component={Link} href="/register" variant="outlined">Register</Button>
            <Button component={Link} href="/contact" variant="outlined">Contact Us</Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>Features</Typography>
        <Grid container spacing={3}>
          {[{
            title: "Books",
            desc: "Explore curated collections and recommendations.",
          }, {
            title: "User Reviews",
            desc: "Read and share honest, insightful reviews.",
          }, {
            title: "Community Growth",
            desc: "Connect, discuss, and learn together.",
          }].map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{f.title}</Typography>
                  <Typography>{f.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
