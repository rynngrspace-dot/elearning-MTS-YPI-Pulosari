import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";
import { getCurrentUser } from "@/lib/auth-service";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Elearning - MTs YPI Pulosari",
  description: "Platform eLearning MTs YPI Pulosari",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider initialUser={user} key={user?.id || 'guest'}>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}