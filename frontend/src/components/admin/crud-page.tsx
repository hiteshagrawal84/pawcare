'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { AdminShell } from '@/components/layout/admin-shell';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { Card, EmptyState, Skeleton, Badge } from '@/components/ui/card';

export type FieldDef = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date' | 'password';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  placeholder?: string;
};

type Props = {
  title: string;
  description?: string;
  columns: Array<{ key: string; label: string; render?: (row: Record<string, unknown>) => React.ReactNode }>;
  fields: FieldDef[];
  load: (search: string) => Promise<Record<string, unknown>[]>;
  create?: (data: Record<string, unknown>) => Promise<void>;
  update?: (id: string, data: Record<string, unknown>) => Promise<void>;
  remove?: (id: string) => Promise<void>;
  getInitial?: (row?: Record<string, unknown>) => Record<string, unknown>;
};

export function AdminCrudPage({
  title,
  description,
  columns,
  fields,
  load,
  create,
  update,
  remove,
  getInitial,
}: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await load(search);
      setRows(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [load, search]);

  useEffect(() => {
    const t = setTimeout(refresh, 200);
    return () => clearTimeout(t);
  }, [refresh]);

  const openCreate = () => {
    setEditing(null);
    setForm(getInitial?.() || {});
    setModal('create');
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    setForm(getInitial?.(row) || { ...row });
    setModal('edit');
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === 'create' && create) await create(form);
      if (modal === 'edit' && update && editing) await update(String(editing._id), form);
      toast.success(modal === 'create' ? 'Created successfully' : 'Updated successfully');
      setModal(null);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!remove || !confirm('Delete this record?')) return;
    try {
      await remove(id);
      toast.success('Deleted');
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
            {title}
          </h1>
          {description && <p className="text-sm text-paw-muted">{description}</p>}
        </div>
        {create && (
          <Button onClick={openCreate}>
            <Plus size={16} /> Add New
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <div className="p-4 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 shadow-none focus:ring-0"
          />
        </div>
      </Card>

      {loading ? (
        <Skeleton className="h-64" />
      ) : !rows.length ? (
        <EmptyState title={`No ${title.toLowerCase()} found`} action={create ? <Button onClick={openCreate}>Add New</Button> : undefined} />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold text-paw-muted">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-paw-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row._id)} className="border-b border-gray-50 hover:bg-gray-50/50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      {c.render
                        ? c.render(row)
                        : String(
                            c.key.includes('.')
                              ? c.key.split('.').reduce((o: unknown, k) => (o as Record<string, unknown>)?.[k], row) ?? ''
                              : row[c.key] ?? ''
                          )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {update && (
                        <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-gray-100 text-paw-muted">
                          <Pencil size={14} />
                        </button>
                      )}
                      {remove && (
                        <button
                          onClick={() => onDelete(String(row._id))}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{modal === 'create' ? `Add ${title}` : `Edit ${title}`}</h3>
            <form onSubmit={save} className="space-y-3">
              {fields.map((f) => (
                <div key={f.name}>
                  <Label>{f.label}</Label>
                  {f.type === 'textarea' ? (
                    <Textarea
                      required={f.required}
                      value={String(form[f.name] ?? '')}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    />
                  ) : f.type === 'select' ? (
                    <Select
                      required={f.required}
                      value={String(form[f.name] ?? '')}
                      onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    >
                      <option value="">Select...</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      type={f.type || 'text'}
                      required={f.required && !(modal === 'edit' && f.type === 'password')}
                      placeholder={f.placeholder}
                      value={String(form[f.name] ?? '')}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'green' | 'orange' | 'red' | 'blue' | 'gray'> = {
    pending: 'orange',
    confirmed: 'blue',
    completed: 'green',
    cancelled: 'red',
    active: 'green',
    inactive: 'gray',
    processing: 'blue',
    shipped: 'blue',
    paid: 'green',
    available: 'green',
    adopted: 'gray',
    approved: 'green',
    rejected: 'red',
    published: 'green',
    draft: 'gray',
  };
  return (
    <Badge variant={map[status] || 'gray'} className="capitalize">
      {status}
    </Badge>
  );
}
