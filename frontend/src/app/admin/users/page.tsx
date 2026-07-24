'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';

export default function AdminUsersPage() {
  return (
    <AdminCrudPage
      title="Users"
      description="Manage admins, doctors, and customers"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        {
          key: 'role',
          label: 'Role',
          render: (r) => <span className="capitalize">{String(r.role).replace('_', ' ')}</span>,
        },
        {
          key: 'isActive',
          label: 'Status',
          render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} />,
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone' },
        { name: 'password', label: 'Password', type: 'password' },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          required: true,
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'doctor', label: 'Doctor' },
            { value: 'customer', label: 'Customer' },
          ],
        },
      ]}
      load={async (search) => {
        const r = await adminApi.getUsers(`limit=50&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      create={async (data) => {
        await adminApi.createUser(data);
      }}
      update={async (id, data) => {
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        await adminApi.updateUser(id, payload);
      }}
      remove={async (id) => {
        await adminApi.deleteUser(id);
      }}
      getInitial={(row) =>
        row
          ? { name: row.name, email: row.email, phone: row.phone, role: row.role, password: '' }
          : { role: 'customer' }
      }
    />
  );
}
