export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}