"use client";
import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Link as MLink, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Card >
        <CardContent>
          <Typography variant="h4" fontWeight={800} gutterBottom>Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              <TextField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
              <Button type="submit" disabled={submitting}>Sign In</Button>
            </Stack>
          </form>
          <Typography sx={{ mt: 2 }}>
            Don’t have an account? <MLink component={Link} href="/auth/register">Register here</MLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}


