"use client";
import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Link as MLink, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000").concat("/user/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, bio })
      });
      const data = await res.json();
      if (!res.ok || data?.Error) throw new Error(data?.Error_Message || "Signup failed");
      localStorage.setItem("ib_token", data.Authentication_Token);
      localStorage.setItem("ib_user", JSON.stringify(data.user));
      document.cookie = "ib_auth=1; path=/; max-age=2592000"; // 30 days
      router.replace("/profile");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxWidth={560} mx="auto">
      <Card>
        <CardContent>
          <Typography variant="h4" fontWeight={800} gutterBottom>Register</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
              <TextField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <TextField type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
              <TextField type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />
              <TextField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} fullWidth multiline minRows={3} />
              <Button type="submit" disabled={submitting}>Create Account</Button>
            </Stack>
          </form>
          <Typography sx={{ mt: 2 }}>
            Already have an account? <MLink component={Link} href="/login">Login here</MLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}


