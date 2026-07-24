'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';
import { formatCurrency } from '@/lib/utils';

export default function AdminDoctorsPage() {
  return (
    <AdminCrudPage
      title="Doctors"
      description="Manage veterinarian profiles and schedules"
      columns={[
        {
          key: 'name',
          label: 'Doctor',
          render: (r) => (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {r.photo ? <img src={String(r.photo)} alt="" className="w-8 h-8 rounded-full object-cover" /> : null}
              <span className="font-medium">{String(r.name)}</span>
            </div>
          ),
        },
        { key: 'specialization', label: 'Specialization' },
        { key: 'experience', label: 'Experience', render: (r) => `${r.experience} yrs` },
        { key: 'consultationFee', label: 'Fee', render: (r) => formatCurrency(Number(r.consultationFee)) },
        { key: 'rating', label: 'Rating', render: (r) => `⭐ ${r.rating}` },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Account Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password' },
        { name: 'specialization', label: 'Specialization', required: true },
        { name: 'experience', label: 'Experience (years)', type: 'number' },
        { name: 'qualification', label: 'Qualification' },
        { name: 'consultationFee', label: 'Consultation Fee', type: 'number' },
        { name: 'photo', label: 'Photo URL' },
        { name: 'bio', label: 'Bio', type: 'textarea' },
      ]}
      load={async (search) => {
        const r = await adminApi.getDoctors(`limit=50&search=${encodeURIComponent(search)}&isActive=all`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      create={async (data) => {
        await adminApi.createDoctor(data);
      }}
      update={async (id, data) => {
        await adminApi.updateDoctor(id, data);
      }}
      remove={async (id) => {
        await adminApi.deleteDoctor(id);
      }}
    />
  );
}

export function AdminServicesPageInner() {
  return (
    <AdminCrudPage
      title="Services"
      description="Manage clinic services and pricing"
      columns={[
        { key: 'name', label: 'Service', render: (r) => `${r.icon || ''} ${r.name}` },
        { key: 'price', label: 'Price', render: (r) => formatCurrency(Number(r.price)) },
        { key: 'duration', label: 'Duration', render: (r) => `${r.duration} min` },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'icon', label: 'Icon (emoji)' },
        { name: 'color', label: 'Background Color' },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'duration', label: 'Duration (min)', type: 'number' },
        { name: 'image', label: 'Image URL' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
      ]}
      load={async (search) => {
        const r = await adminApi.getServices(`limit=50&all=true&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      create={async (data) => {
        await adminApi.createService(data);
      }}
      update={async (id, data) => {
        await adminApi.updateService(id, data);
      }}
      remove={async (id) => {
        await adminApi.deleteService(id);
      }}
      getInitial={(row) => (row ? { ...row } : { status: 'active', icon: '🐾', color: '#e8f5e9' })}
    />
  );
}
