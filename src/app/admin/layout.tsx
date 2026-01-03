export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is now handled by middleware.ts
  // This layout just provides the common structure
  return <>{children}</>;
}
