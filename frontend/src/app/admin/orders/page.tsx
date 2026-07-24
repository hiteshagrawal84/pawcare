'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  return (
    <AdminCrudPage
      title="Orders"
      description="Manage orders, payments, and shipping"
      columns={[
        { key: 'orderNumber', label: 'Order #' },
        {
          key: 'customer',
          label: 'Customer',
          render: (r) =>
            typeof r.customer === 'object' && r.customer
              ? String((r.customer as { name: string }).name)
              : '—',
        },
        { key: 'total', label: 'Total', render: (r) => formatCurrency(Number(r.total)) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
        { key: 'createdAt', label: 'Date', render: (r) => formatDate(String(r.createdAt)) },
      ]}
      fields={[
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
        {
          name: 'paymentStatus',
          label: 'Payment',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'failed', label: 'Failed' },
            { value: 'refunded', label: 'Refunded' },
          ],
        },
        { name: 'trackingNumber', label: 'Tracking Number' },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
      load={async (search) => {
        const r = await adminApi.getOrders(`limit=50&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      update={async (id, data) => {
        await adminApi.updateOrder(id, data);
      }}
      getInitial={(row) =>
        row
          ? {
              status: row.status,
              paymentStatus: row.paymentStatus,
              trackingNumber: row.trackingNumber || '',
              notes: row.notes || '',
            }
          : {}
      }
    />
  );
}
