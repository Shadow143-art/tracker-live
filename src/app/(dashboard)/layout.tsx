import ClientLayout from './client-layout';
import ServerLayout from './server-layout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServerLayout>
      <ClientLayout>{children}</ClientLayout>
    </ServerLayout>
  );
}
