"use client";
import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch((process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000").concat("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      if (!res.ok || data?.Error) throw new Error(data?.Error_Message || "Request failed");
      setSuccess("Thanks for reaching out! We'll get back to you soon.");
      setName(""); setEmail(""); setMessage("");
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h3" fontWeight={800} gutterBottom>Contact Us</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Have a question or suggestion? We'd love to hear from you.
      </Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
              <TextField type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
              <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required fullWidth multiline minRows={4} />
              <Button type="submit" disabled={submitting}>Send Message</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}


