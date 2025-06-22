import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
}
