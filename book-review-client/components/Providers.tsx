"use client";
import { ReactNode, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createTheme from "@mui/material/styles/createTheme";
import { deepOrange, orange } from "@mui/material/colors";
 

function getTheme(mode: "light" | "dark") {
  const lightPrimary = "#463C2B";
  const lightSecondary = "#5E503A";
  const lightText = "#463C2B";
  const darkText = "#EFEDE7"; // off-white for dark background
  const darkBase = "#0a0908";

  const base = createTheme({
    cssVariables: true,
    colorSchemes: { light: true, dark: true },
    palette: {
      mode,
      primary: {
        main: mode === "light" ? lightPrimary : orange[300],
        light: mode === "light" ? lightPrimary : orange[200],
        dark: mode === "light" ? "#2f281d" : orange[400],
        contrastText: "white",
      },
      secondary: {
        main: mode === "light" ? lightSecondary : deepOrange[300],
        light: mode === "light" ? lightSecondary : deepOrange[200] as any,
        dark: mode === "light" ? "#3f3628" : deepOrange[400],
        contrastText: "white",
      },
      text: {
        primary: mode === "light" ? lightText : darkText,
        secondary: mode === "light" ? lightSecondary : "rgba(239,237,231,0.72)",
      },
      background: {
        default: darkBase,
        paper: "#141210",
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
  });

  return createTheme(base, {
    components: {
      MuiButton: { defaultProps: { variant: "contained", color: 'primary' } },
      MuiLink: { defaultProps: { underline: "hover" } },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: base.palette.background.paper,
            color: base.palette.text.primary,
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: base.palette.text.primary,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: (theme: Theme) => ({
          ':root': {
            '--mui-palette-primary-main': theme.palette.primary.main,
            '--mui-palette-secondary-main': theme.palette.secondary.main,
            '--mui-palette-text-primary': theme.palette.text.primary,
          },
          html: { height: "100%" },
          body: {
            minHeight: "100dvh",
            background: `linear-gradient(135deg, #0a0908 0%, #1b1713 100%)`,
            color: base.palette.text.primary
          },
          '#__next, #root': { minHeight: "100%" },
          '.MuiIconButton-root': {
            color: base.palette.text.primary,
          },
        }),
      },
    },
  });
}

export default function Providers({ children }: { children: ReactNode }) {
  const mode = "dark" as const;
  const theme = useMemo(() => getTheme(mode), []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}


