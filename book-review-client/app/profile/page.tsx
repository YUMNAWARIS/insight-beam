"use client";
import { useEffect, useState } from "react";
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

type StoredUser = {
  user_name: string;
  user_email: string;
  user_bio?: string;
  liked_books?: any[];
  created_books?: any[];
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("ib_token");
    const u = localStorage.getItem("ib_user");
    if (!token || !u) {
      router.replace("/login");
      return;
    }
    try {
      setUser(JSON.parse(u));
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!user) return null;

  const initials = user.user_name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

  return (
    <Box maxWidth={800} mx="auto">
      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
            <Avatar sx={{ width: 80, height: 80 }}>{initials || "U"}</Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{user.user_name}</Typography>
              <Typography color="text.secondary">{user.user_email}</Typography>
            </Box>
          </Stack>
          {user.user_bio && (
            <Typography sx={{ mt: 2 }}>{user.user_bio}</Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            <Chip label={`Liked: ${user.liked_books?.length ?? 0}`} />
            <Chip label={`Created: ${user.created_books?.length ?? 0}`} />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}


