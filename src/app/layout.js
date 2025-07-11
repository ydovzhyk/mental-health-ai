import { Geist, Geist_Mono } from "next/font/google"
import { StoreProvider } from '@/redux/store-provider'
import { LanguageProvider } from '@/utils/translating/language-context'
import ClientLayout from './client-layout';
import "../app/css/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StoreProvider>
        <LanguageProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ClientLayout>{children}</ClientLayout>
          </body>
        </LanguageProvider>
      </StoreProvider>
    </html>
  );
}
