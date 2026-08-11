'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';

export default function AdminAdoptionPage() {
  return (
    <AdminCrudPage
      title="Adoption"
      description="Manage adoptable pets and requests"
      columns={[
        { key: 'name', label: 'Pet' },
        { key: 'breed', label: 'Breed' },
        { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{String(r.type)}</span> },
        { key: 'age', label: 'Age' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
        {
          key: 'requests',
          label: 'Requests',
          render: (r) => String(Array.isArray(r.requests) ? r.requests.length : 0),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          required: true,
          options: [
            { value: 'dog', label: 'Dog' },
            { value: 'cat', label: 'Cat' },
            { value: 'rabbit', label: 'Rabbit' },
            { value: 'bird', label: 'Bird' },
            { value: 'other', label: 'Other' },
          ],
        },
        { name: 'breed', label: 'Breed', required: true },
        { name: 'age', label: 'Age', required: true },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ],
        },
        { name: 'location', label: 'Location' },
        { name: 'images', label: 'Image URL' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'available', label: 'Available' },
            { value: 'pending', label: 'Pending' },
            { value: 'adopted', label: 'Adopted' },
          ],
        },
      ]}
      load={async (search) => {
        const r = await adminApi.getAdoptions(`limit=50&all=true&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      create={async (data) => {
        await adminApi.createAdoption({
          ...data,
          images: data.images ? [data.images] : [],
        });
      }}
      update={async (id, data) => {
        await adminApi.updateAdoption(id, {
          ...data,
          images: data.images ? (Array.isArray(data.images) ? data.images : [data.images]) : [],
        });
      }}
      remove={async (id) => {
        await adminApi.deleteAdoption(id);
      }}
      getInitial={(row) =>
        row
          ? { ...row, images: Array.isArray(row.images) ? (row.images as string[])[0] : '' }
          : { type: 'dog', gender: 'male', status: 'available' }
      }
    />
  );
}
