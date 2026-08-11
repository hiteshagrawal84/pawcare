'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { AdminShell } from '@/components/layout/admin-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi } from '@/services';
import { formatCurrency } from '@/lib/utils';
import type { Settings } from '@/types';

export function AdminPetsPage() {
  return (
    <AdminCrudPage
      title="Pets"
      description="Customer pet profiles and health records"
      columns={[
        { key: 'name', label: 'Pet' },
        { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{String(r.type)}</span> },
        { key: 'breed', label: 'Breed' },
        { key: 'age', label: 'Age' },
        {
          key: 'owner',
          label: 'Owner',
          render: (r) =>
            typeof r.owner === 'object' && r.owner ? String((r.owner as { name: string }).name) : '—',
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'dog', label: 'Dog' },
            { value: 'cat', label: 'Cat' },
            { value: 'rabbit', label: 'Rabbit' },
            { value: 'bird', label: 'Bird' },
            { value: 'other', label: 'Other' },
          ],
        },
        { name: 'breed', label: 'Breed' },
        { name: 'age', label: 'Age' },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'unknown', label: 'Unknown' },
          ],
        },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
      load={async (search) => {
        const r = await adminApi.getPets(`limit=50&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
    />
  );
}

export function AdminMediaPage() {
  const [items, setItems] = useState<Array<{ _id: string; url: string; originalName: string; type: string }>>([]);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    adminApi.getMedia('limit=50').then((r) => setItems(r.data as typeof items)).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'media');
      await adminApi.uploadMedia(fd);
      toast.success('Uploaded');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            Media Library
          </h1>
          <p className="text-sm text-paw-muted">S3-compatible image & video storage</p>
        </div>
        <label className="btn-primary px-5 py-2.5 cursor-pointer inline-flex">
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" className="hidden" onChange={onUpload} accept="image/*,video/*,.pdf" />
        </label>
      </div>
      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((m) => (
          <Card key={m._id} className="overflow-hidden">
            {m.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.url} alt={m.originalName} className="w-full aspect-square object-cover" />
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gray-50 text-3xl">📄</div>
            )}
            <CardContent className="p-3">
              <p className="text-xs truncate">{m.originalName}</p>
              <button
                className="text-xs text-red-500 mt-2"
                onClick={async () => {
                  await adminApi.deleteMedia(m._id);
                  load();
                }}
              >
                Delete
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then((r) => setSettings(r.data));
  }, []);

  if (!settings) {
    return (
      <AdminShell>
        <p className="text-paw-muted">Loading settings...</p>
      </AdminShell>
    );
  }

  const save = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            Settings
          </h1>
          <p className="text-sm text-paw-muted">Website, SEO, and contact configuration</p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Site Name</Label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
            <div>
              <Label>Announcement</Label>
              <Input
                value={settings.announcement.text}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, text: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(['email', 'phone', 'emergencyPhone', 'address', 'hours'] as const).map((k) => (
              <div key={k}>
                <Label className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  value={settings.contact[k]}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, [k]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Meta Title</Label>
              <Input
                value={settings.seo.metaTitle}
                onChange={(e) =>
                  setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value } })
                }
              />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Textarea
                value={settings.seo.metaDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, metaDescription: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
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
