"use client";
import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Link as MLink, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
      const res = await fetch((process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000").concat("/user/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || data?.Error) throw new Error(data?.Error_Message || "Login failed");
      localStorage.setItem("ib_token", data.Authentication_Token);
      localStorage.setItem("ib_user", JSON.stringify(data.user));
      document.cookie = "ib_auth=1; path=/; max-age=2592000"; // 30 days
      router.replace("/profile");
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
            Don’t have an account? <MLink component={Link} href="/register">Register here</MLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}


