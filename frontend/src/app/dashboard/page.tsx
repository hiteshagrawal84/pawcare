import { Suspense } from 'react';
import CustomerDashboardPage from './dashboard-client';

export default function Page() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-paw-muted">Loading dashboard...</div>}>
      <CustomerDashboardPage />
    </Suspense>
  );
}
