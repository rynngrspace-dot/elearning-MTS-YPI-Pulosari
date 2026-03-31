import "./globals.css";
import { AuthProvider } from "./lib/AuthContext";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export const metadata = {
  title: "ElearningJamil - Portal",
  description: "Platform eLearning",
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  let user = null;

  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    if (user) {
      // Tambahkan avatar default jika tidak ada di DB
      user.avatar = `https://ui-avatars.com/api/?name=${user.name || user.email}&background=random`;
      // Map name ke nama agar Sidebar tidak pecah jika masih pakai 'nama'
      user.nama = user.name || user.email;
    }
  }

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
        <AuthProvider initialUser={user} key={session?.id || 'guest'}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}