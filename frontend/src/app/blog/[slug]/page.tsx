'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SiteShell } from '@/components/layout/site-shell';
import { Skeleton } from '@/components/ui/card';
import { publicApi } from '@/services';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/types';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getBlog(slug)
      .then((r) => setPost(r.data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <SiteShell>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Skeleton className="h-64 mb-6" />
          <Skeleton className="h-10 mb-4" />
          <Skeleton className="h-40" />
        </div>
      </SiteShell>
    );
  }

  if (!post) {
    return (
      <SiteShell>
        <div className="text-center py-20">
          <p>Post not found</p>
          <Link href="/blog" className="text-paw-green font-semibold">
            Back to blog
          </Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <span className="text-sm font-bold text-paw-green">{post.category}</span>
        <h1 className="text-4xl font-extrabold mt-2 mb-4 text-paw-charcoal font-[family-name:var(--font-jakarta)]">
          {post.title}
        </h1>
        <p className="text-sm text-paw-muted mb-8">
          {post.publishedAt ? formatDate(post.publishedAt) : ''} · {post.author?.name}
        </p>
        {post.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.featuredImage} alt={post.title} className="w-full rounded-3xl mb-8 aspect-video object-cover" />
        )}
        <div
          className="prose prose-lg max-w-none text-paw-charcoal leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </SiteShell>
  );
}
