'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  return (
    <AdminCrudPage
      title="Products"
      description="Ecommerce product catalog"
      columns={[
        { key: 'name', label: 'Product' },
        { key: 'sku', label: 'SKU' },
        { key: 'price', label: 'Price', render: (r) => formatCurrency(Number(r.price)) },
        { key: 'stock', label: 'Stock' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'stock', label: 'Stock', type: 'number' },
        { name: 'sku', label: 'SKU' },
        { name: 'images', label: 'Image URL', placeholder: 'https://...' },
        {
          name: 'badge',
          label: 'Badge',
          type: 'select',
          options: [
            { value: '', label: 'None' },
            { value: 'Best Seller', label: 'Best Seller' },
            { value: 'New', label: 'New' },
            { value: 'Sale', label: 'Sale' },
          ],
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'out_of_stock', label: 'Out of Stock' },
          ],
        },
      ]}
      load={async (search) => {
        const r = await adminApi.getProducts(`limit=50&all=true&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      create={async (data) => {
        const payload = {
          ...data,
          images: data.images ? [String(data.images)] : [],
        };
        await adminApi.createProduct(payload);
      }}
      update={async (id, data) => {
        const payload = {
          ...data,
          images: data.images
            ? Array.isArray(data.images)
              ? data.images
              : [String(data.images)]
            : [],
        };
        await adminApi.updateProduct(id, payload);
      }}
      remove={async (id) => {
        await adminApi.deleteProduct(id);
      }}
      getInitial={(row) =>
        row
          ? {
              ...row,
              images: Array.isArray(row.images) ? (row.images as string[])[0] || '' : '',
            }
          : { status: 'active', stock: 0 }
      }
    />
  );
}
