'use client';

import { AdminCrudPage } from '@/components/admin/crud-page';
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
