import AdminClient from "@/components/AdminClient";

export const metadata = {
  title: "Admin — Dagout.be",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
