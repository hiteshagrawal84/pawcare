'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';
import { formatDate } from '@/lib/utils';

export default function AdminAppointmentsPage() {
  return (
    <AdminCrudPage
      title="Appointments"
      description="View, approve, and manage appointments"
      columns={[
        { key: 'name', label: 'Customer' },
        {
          key: 'service',
          label: 'Service',
          render: (r) =>
            typeof r.service === 'object' && r.service
              ? String((r.service as { name: string }).name)
              : '—',
        },
        {
          key: 'doctor',
          label: 'Doctor',
          render: (r) =>
            typeof r.doctor === 'object' && r.doctor
              ? String((r.doctor as { name: string }).name)
              : 'Unassigned',
        },
        { key: 'date', label: 'Date', render: (r) => formatDate(String(r.date)) },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
      ]}
      fields={[
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
        { name: 'doctor', label: 'Doctor ID' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'timeSlot', label: 'Time Slot' },
        { name: 'adminNotes', label: 'Admin Notes', type: 'textarea' },
      ]}
      load={async (search) => {
        const r = await adminApi.getAppointments(`limit=50&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      update={async (id, data) => {
        await adminApi.updateAppointment(id, data);
      }}
      remove={async (id) => {
        await adminApi.deleteAppointment(id);
      }}
      getInitial={(row) =>
        row
          ? {
              status: row.status,
              doctor:
                typeof row.doctor === 'object' && row.doctor
                  ? (row.doctor as { _id: string })._id
                  : row.doctor || '',
              date: row.date ? String(row.date).slice(0, 10) : '',
              timeSlot: row.timeSlot || '',
              adminNotes: row.adminNotes || '',
            }
          : { status: 'pending' }
      }
    />
  );
}
