import "@/css/main.css";
import type { Metadata } from "next";
import { fonts } from "@/config/chakra.fonts";
import { Providers } from "./providers";
import NavigationBar from "@/components/navigation.bar";

export const metadata: Metadata = {
  title: "Delos News",
  openGraph: {
    title: "Delos News",
    description: "A website for ordering articles and news",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="A website for ordering articles and news"
        />
      </head>
      <body className={fonts.rubik.className}>
        <Providers>
          <NavigationBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
