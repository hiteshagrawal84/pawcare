'use client';

import { AdminCrudPage, StatusBadge } from '@/components/admin/crud-page';
import { adminApi } from '@/services';

export default function AdminBlogsPage() {
  return (
    <AdminCrudPage
      title="Blogs"
      description="SEO-friendly blog CMS"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge status={String(r.status)} /> },
        { key: 'views', label: 'Views' },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'content', label: 'Content (HTML)', type: 'textarea', required: true },
        { name: 'featuredImage', label: 'Featured Image URL' },
        {
          name: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: 'Pet Health', label: 'Pet Health' },
            { value: 'Training', label: 'Training' },
            { value: 'Nutrition', label: 'Nutrition' },
            { value: 'Grooming', label: 'Grooming' },
          ],
        },
        { name: 'metaTitle', label: 'Meta Title' },
        { name: 'metaDescription', label: 'Meta Description', type: 'textarea' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
          ],
        },
      ]}
      load={async (search) => {
        const r = await adminApi.getBlogs(`limit=50&all=true&search=${encodeURIComponent(search)}`);
        return r.data as unknown as Record<string, unknown>[];
      }}
      create={async (data) => {
        await adminApi.createBlog(data);
      }}
      update={async (id, data) => {
        await adminApi.updateBlog(id, data);
      }}
      remove={async (id) => {
        await adminApi.deleteBlog(id);
      }}
      getInitial={(row) => (row ? { ...row } : { status: 'draft', category: 'Pet Health' })}
    />
  );
}
