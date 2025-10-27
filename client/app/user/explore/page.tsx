"use client";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, likeBook, unlikeBook, saveBook, unsaveBook } from "@/lib/api";
import { Alert, Box, Card, CardActionArea, CardContent, CircularProgress, Grid, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
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
  like_count?: number;
  save_count?: number;
  is_liked_by_current_user?: boolean;
  is_saved_by_current_user?: boolean;
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

  const toggleLike = async (bookId: string, liked: boolean) => {
    try {
      const res = liked ? await unlikeBook(bookId) : await likeBook(bookId);
      const updated = res?.book as Book | undefined;
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, ...updated, is_liked_by_current_user: !liked, like_count: updated?.like_count ?? ((b.like_count || 0) + (liked ? -1 : 1)) } : b)));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const toggleSave = async (bookId: string, saved: boolean) => {
    try {
      if (saved) {
        await unsaveBook(bookId);
      } else {
        await saveBook(bookId);
      }
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, is_saved_by_current_user: !saved, save_count: (b.save_count || 0) + (saved ? -1 : 1) } : b)));
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
                        <Tooltip title={b.is_liked_by_current_user ? "Unlike" : "Like"}>
                          <IconButton size="small" onClick={() => toggleLike(b.id, Boolean(b.is_liked_by_current_user))}>
                            {b.is_liked_by_current_user ? <FavoriteIcon color="error" fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">{b.like_count ?? 0}</Typography>
                        <Tooltip title={b.is_saved_by_current_user ? "Unsave" : "Save"}>
                          <IconButton size="small" onClick={() => toggleSave(b.id, Boolean(b.is_saved_by_current_user))}>
                            {b.is_saved_by_current_user ? <BookmarkIcon color="primary" fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
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
              <Alert severity="info">No books found.</Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

