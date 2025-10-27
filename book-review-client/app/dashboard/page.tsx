"use client";
import { useAuth } from "@/context/AuthContext";
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, initializing, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [initializing, isAuthenticated, router]);

  if (initializing) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="40dvh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Box maxWidth={720} mx="auto">
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Welcome back{user?.user_name ? `, ${user.user_name}` : ""}!
          </Typography>
          <Alert severity="info">This is a protected page.</Alert>
        </CardContent>
      </Card>
    </Box>
  );
}


