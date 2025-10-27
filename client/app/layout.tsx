import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Container from "@mui/material/Container";
import NavbarSwitch from "@/components/NavbarSwitch";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Insight Beam",
  description: "Discover insights, share and recommend books, and grow your knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavbarSwitch />
          <Container component="main" sx={{ py: 6, minHeight: 'calc(100dvh - 112px)' }}>
            {children}
          </Container>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
