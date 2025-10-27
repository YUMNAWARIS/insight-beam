"use client";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, unsaveBook } from "@/lib/api";
import { Alert, Box, Card, CardActionArea, CardContent, CircularProgress, Grid, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  description: string;
  isbn: string;
  genre: string;
  language: string;
  like_count?: number;
  save_count?: number;
};

export default function MyCollectionsPage() {
  const { isAuthenticated, initializing } = useAuth();
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
        const data = await apiFetch("/collection");
        const list = (data?.books || []) as Book[];
        setBooks(list);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [initializing, isAuthenticated]);

  const onUnsave = async (bookId: string) => {
    try {
      await unsaveBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (e) {
      setError((e as Error).message);
    }
  };

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
          My Collection
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Books you have saved.
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
                <CardActionArea disableRipple component="div">
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
                    <Box mt={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title="Unsave">
                          <IconButton size="small" onClick={() => onUnsave(b.id)}>
                            <BookmarkRemoveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">{b.save_count ?? 0}</Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {!books.length && (
            <Grid item xs={12}>
              <Alert severity="info">You have not saved any books yet.</Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}


