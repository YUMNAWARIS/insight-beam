"use client";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Alert, Box, Card, CardActionArea, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Book = {
  id: string;
  title: string;
  description: string;
  isbn: string;
  genre: string;
  language: string;
  created_at?: string;
  updated_at?: string;
};

export default function ExplorePage() {
  const { isAuthenticated, initializing, user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [initializing, isAuthenticated, router]);

  useEffect(() => {
    const load = async () => {
      if (initializing || !isAuthenticated) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch("/book");
        const list = (data?.Books || []) as Book[];
        setBooks(list);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initializing, isAuthenticated]);

  if (initializing) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="40dvh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Box maxWidth={1200} mx="auto" px={2} py={3}>
      <Box mb={2}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Explore our latest Books
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Discover newly added titles first.
        </Typography>
      </Box>

      {loading && (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="30dvh">
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">{error}</Alert>
      )}

      {!loading && !error && (
        <Grid container spacing={2}>
          {books.map((b) => (
            <Grid item key={b.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea disableRipple>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                      {b.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      {b.genre || "Unknown"} · {b.language?.toUpperCase?.() || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {b.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {!books.length && (
            <Grid item xs={12}>
              <Alert severity="info">No books found.</Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

