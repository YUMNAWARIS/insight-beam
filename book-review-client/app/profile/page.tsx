"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff, Upload as UploadIcon, Save as SaveIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { api } from "@/lib/axios";

type StoredUser = {
  user_name: string;
  user_email: string;
  user_profile?: Record<string, unknown> | null;
};

type ProfileInfo = {
  username: string;
  first_name: string;
  last_name: string;
  nickname: string;
  country: string;
  city: string;
};

type ContactInfo = {
  email: string;
  whatsapp?: string;
  telegram?: string;
  website?: string;
  bio?: string;
};

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Germany", "France", "India"];

export default function ProfilePage() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("ib_token") : null;
    const u = typeof window !== "undefined" ? localStorage.getItem("ib_user") : null;
    if (!token || !u) {
      router.replace("/login");
      return;
    }
    try {
      const parsed = JSON.parse(u) as StoredUser;
      setStoredUser(parsed);
      const profile = (parsed.user_profile?.data || {}) as Record<string, unknown>;
      const img = (profile && (profile["profile_image"] as string)) || null;
      setProfileImageUrl(img);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const initials = useMemo(() => {
    const name = storedUser?.user_name || "";
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  }, [storedUser]);

  const defaultProfileInfo: ProfileInfo = useMemo(
    () => {
      const profile = (storedUser?.user_profile?.data || {}) as Record<string, unknown>;
      return {
        username: storedUser?.user_name ?? "",
        first_name: (profile["first_name"] as string) || "",
        last_name: (profile["last_name"] as string) || "",
        nickname: (profile["nickname"] as string) || "",
        country: (profile["country"] as string) || "",
        city: (profile["city"] as string) || "",
      };
    },
    [storedUser]
  );

  const defaultContactInfo: ContactInfo = useMemo(
    () => {
      const profile = (storedUser?.user_profile?.data || {}) as Record<string, unknown>;
      return {
        email: storedUser?.user_email ?? "",
        whatsapp: (profile["whatsapp"] as string) || "",
        telegram: (profile["telegram"] as string) || "",
        website: (profile["website"] as string) || "",
        bio: (profile["bio"] as string) || "",
      };
    },
    [storedUser]
  );

  const profileValidation = Yup.object({
    username: Yup.string().required("Username is required"),
    first_name: Yup.string().max(50, "Max 50 characters"),
    last_name: Yup.string().max(50, "Max 50 characters"),
    nickname: Yup.string().max(50, "Max 50 characters"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().max(100, "Max 100 characters"),
  });

  const contactValidation = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    whatsapp: Yup.string().max(100, "Max 100 characters"),
    telegram: Yup.string().max(100, "Max 100 characters"),
    website: Yup.string().url("Invalid URL").nullable(),
    bio: Yup.string().max(1000, "Max length is 1000"),
  });

  const profileForm = useFormik<ProfileInfo>({
    enableReinitialize: true,
    initialValues: defaultProfileInfo,
    validationSchema: profileValidation,
    onSubmit: async (values: ProfileInfo, helpers: FormikHelpers<ProfileInfo>) => {
      try {
        const res = await api.patch("/user/profile", values);
        // Update local user profile cache
        const stored = typeof window !== "undefined" ? localStorage.getItem("ib_user") : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as any;
            const updated = (res as any)?.data?.profile;
            if (updated) {
              parsed.user_profile = updated;
              localStorage.setItem("ib_user", JSON.stringify(parsed));
              setStoredUser(parsed);
            }
          } catch {}
        }
        setIsError(false);
        setStatusMessage("Profile information saved.");
      } catch (e: unknown) {
        setIsError(true);
        setStatusMessage((e as Error).message);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const contactForm = useFormik<ContactInfo>({
    enableReinitialize: true,
    initialValues: defaultContactInfo,
    validationSchema: contactValidation,
    onSubmit: async (values: ContactInfo, helpers: FormikHelpers<ContactInfo>) => {
      try {
        const res = await api.patch("/user/profile", values);
        const stored = typeof window !== "undefined" ? localStorage.getItem("ib_user") : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as any;
            const updated = (res as any)?.data?.profile;
            if (updated) {
              parsed.user_profile = updated;
              localStorage.setItem("ib_user", JSON.stringify(parsed));
              setStoredUser(parsed);
            }
          } catch {}
        }
        setIsError(false);
        setStatusMessage("Contact and bio saved.");
      } catch (e: unknown) {
        setIsError(true);
        setStatusMessage((e as Error).message);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleSaveAll = useCallback(async () => {
    await Promise.all([profileForm.submitForm(), contactForm.submitForm()]);
  }, [profileForm, contactForm]);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      setIsError(true);
      setStatusMessage("Both old and new password are required");
      return;
    }
    try {
      setChangingPassword(true);
      await api.post("/user/change-password", { oldPassword, newPassword });
      setIsError(false);
      setStatusMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (e: unknown) {
      setIsError(true);
      setStatusMessage((e as Error).message);
    } finally {
      setChangingPassword(false);
    }
  };

  const onSelectImage = async (file?: File | null) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImagePreviewUrl(localUrl);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post<{ data: unknown }>("/image/upload_image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Backend returns { Image_URL }
      const imageUrl = (res as unknown as { data: { Image_URL?: string } }).data?.Image_URL || null;
      if (imageUrl) {
        setProfileImageUrl(imageUrl);
        const stored = typeof window !== "undefined" ? localStorage.getItem("ib_user") : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as any;
            const currentData = (parsed?.user_profile?.data || {}) as Record<string, unknown>;
            const updatedData = { ...currentData, profile_image: imageUrl };
            if (parsed.user_profile) {
              parsed.user_profile = { ...parsed.user_profile, data: updatedData };
            } else {
              parsed.user_profile = { data: updatedData };
            }
            localStorage.setItem("ib_user", JSON.stringify(parsed));
            setStoredUser(parsed);
          } catch {}
        }
        setIsError(false);
        setStatusMessage("Profile photo updated.");
      }
    } catch (e: unknown) {
      setIsError(true);
      setStatusMessage((e as Error).message);
    }
  };

  if (!storedUser) return null;

  return (
    <Box className="min-h-screen bg-gray-50">

      <Box className="max-w-7xl mx-auto p-4">
        {statusMessage && (
          <Alert severity={isError ? "error" : "success"} sx={{ mb: 2 }} onClose={() => setStatusMessage(null)}>
            {statusMessage}
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Left Sidebar - Account Management */}
          <Grid item xs={12} lg={3} ref={accountRef}>
            <Stack spacing={2}>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader title="Account Management" />
                <CardContent>
                  <Stack direction="column" spacing={2} alignItems="center">
                    <Avatar src={imagePreviewUrl || profileImageUrl || undefined} sx={{ width: 96, height: 96 }}>
                      {initials}
                    </Avatar>
                    <Button component="label" variant="outlined" startIcon={<UploadIcon />}>
                      Upload Photo
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        hidden
                        onChange={(e) => onSelectImage(e.target.files?.[0])}
                      />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader title="Change Password" />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      type={showOld ? "text" : "password"}
                      label="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowOld((s) => !s)} aria-label="toggle old password visibility">
                            {showOld ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                    <TextField
                      type={showNew ? "text" : "password"}
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowNew((s) => !s)} aria-label="toggle new password visibility">
                            {showNew ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                    <Button onClick={handleChangePassword} variant="contained" disabled={changingPassword}>
                      Change Password
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Side - Two stacked sections */}
          <Grid item xs={12} lg={9}>
            <Stack spacing={2}>
              <div ref={profileRef}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader title="Profile Information" />
                  <CardContent>
                    <form onSubmit={profileForm.handleSubmit} className="space-y-4">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="username"
                            label="Username"
                            value={profileForm.values.username}
                            onChange={profileForm.handleChange}
                            onBlur={profileForm.handleBlur}
                            error={profileForm.touched.username && Boolean(profileForm.errors.username)}
                            helperText={profileForm.touched.username && profileForm.errors.username}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="nickname"
                            label="Nickname"
                            value={profileForm.values.nickname}
                            onChange={profileForm.handleChange}
                            onBlur={profileForm.handleBlur}
                            error={profileForm.touched.nickname && Boolean(profileForm.errors.nickname)}
                            helperText={profileForm.touched.nickname && profileForm.errors.nickname}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="first_name"
                            label="First Name"
                            value={profileForm.values.first_name}
                            onChange={profileForm.handleChange}
                            onBlur={profileForm.handleBlur}
                            error={profileForm.touched.first_name && Boolean(profileForm.errors.first_name)}
                            helperText={profileForm.touched.first_name && profileForm.errors.first_name}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="last_name"
                            label="Last Name"
                            value={profileForm.values.last_name}
                            onChange={profileForm.handleChange}
                            onBlur={profileForm.handleBlur}
                            error={profileForm.touched.last_name && Boolean(profileForm.errors.last_name)}
                            helperText={profileForm.touched.last_name && profileForm.errors.last_name}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth error={Boolean(profileForm.touched.country && profileForm.errors.country)}>
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select
                              labelId="country-label"
                              name="country"
                              label="Country"
                              value={profileForm.values.country}
                              onChange={profileForm.handleChange}
                              onBlur={profileForm.handleBlur}
                            >
                              {COUNTRIES.map((c) => (
                                <MenuItem key={c} value={c}>
                                  {c}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="city"
                            label="City"
                            value={profileForm.values.city}
                            onChange={profileForm.handleChange}
                            onBlur={profileForm.handleBlur}
                            error={profileForm.touched.city && Boolean(profileForm.errors.city)}
                            helperText={profileForm.touched.city && profileForm.errors.city}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div ref={contactRef}>
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader title="Contact Info + About the User" />
                  <CardContent>
                    <form onSubmit={contactForm.handleSubmit} className="space-y-4">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="email"
                            label="Email"
                            required
                            value={contactForm.values.email}
                            onChange={contactForm.handleChange}
                            onBlur={contactForm.handleBlur}
                            error={contactForm.touched.email && Boolean(contactForm.errors.email)}
                            helperText={contactForm.touched.email && contactForm.errors.email}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            name="website"
                            label="Website"
                            value={contactForm.values.website || ""}
                            onChange={contactForm.handleChange}
                            onBlur={contactForm.handleBlur}
                            error={contactForm.touched.website && Boolean(contactForm.errors.website)}
                            helperText={contactForm.touched.website && contactForm.errors.website}
                            fullWidth
                          />
                        </Grid>
                    
                      </Grid>
                      <div style={{ marginTop: 16 }} >
                            <TextField
                              name="bio"
                              label="Biographical Info"
                              multiline
                              minRows={4}
                              value={contactForm.values.bio || ""}
                              onChange={contactForm.handleChange}
                              onBlur={contactForm.handleBlur}
                              fullWidth
                            />
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Button onClick={handleSaveAll} startIcon={<SaveIcon />} variant="contained" >Save All</Button>
              </div>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
