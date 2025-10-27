"use client";
import { Box, Container, Grid, Typography, Card, CardMedia, CardContent } from "@mui/material";

export default function AboutPage() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight={800} gutterBottom>
            About Insight Beam
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Insight Beam is a community-driven platform to discover books, share reviews,
            and grow your knowledge through collective wisdom. Our mission is to make reading
            more social, insightful, and fun.
          </Typography>
          <Typography>
            Whether you're looking for your next read or want to champion a hidden gem, Insight Beam helps
            you explore, reflect, and connect with others who love books.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height={300}
              alt="Reading illustration"
              src="/window.svg"
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                A window into ideas: reading illuminates paths to lifelong learning.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}


