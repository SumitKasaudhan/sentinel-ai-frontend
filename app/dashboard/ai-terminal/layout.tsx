import { requirePro } from "@/lib/requirePro";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePro();
  return <>{children}</>;
}