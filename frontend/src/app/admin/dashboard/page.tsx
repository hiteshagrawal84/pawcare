'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui/card';
import { adminApi } from '@/services';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Appointment } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((r) => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = (stats?.cards as Record<string, number>) || {};
  const charts = (stats?.charts as {
    appointments: Array<{ _id: string; count: number }>;
    revenue: Array<{ _id: string; revenue: number }>;
    customerGrowth: Array<{ _id: string; count: number }>;
  }) || { appointments: [], revenue: [], customerGrowth: [] };
  const recent = (stats?.recentAppointments as Appointment[]) || [];

  const cardItems = [
    { label: 'Total Customers', value: cards.totalCustomers, color: 'text-paw-green' },
    { label: 'Appointments', value: cards.appointments, color: 'text-blue-500' },
    { label: 'Doctors', value: cards.doctors, color: 'text-purple-500' },
    { label: 'Revenue', value: formatCurrency(cards.revenue || 0), color: 'text-paw-orange' },
    { label: 'Products Sold', value: cards.productsSold, color: 'text-teal-500' },
    { label: 'Adoption Requests', value: cards.adoptionRequests, color: 'text-pink-500' },
  ];

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-paw-charcoal font-[family-name:var(--font-jakarta)]">
          Dashboard
        </h1>
        <p className="text-paw-muted text-sm">Overview of your PawCare platform</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {cardItems.map((c) => (
              <Card key={c.label}>
                <CardContent className="pt-5">
                  <p className="text-sm text-paw-muted">{c.label}</p>
                  <p className={`text-3xl font-extrabold mt-1 font-[family-name:var(--font-jakarta)] ${c.color}`}>
                    {c.value ?? 0}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Statistics</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.appointments}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#5CB85C" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#FF9F43" fill="#FF9F4330" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.customerGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#5CB85C" fill="#5CB85C30" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recent.map((a) => (
                    <div key={a._id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-paw-muted">
                          {typeof a.service === 'object' ? a.service.name : 'Service'} · {formatDate(a.date)}
                        </p>
                      </div>
                      <span className="capitalize text-xs font-semibold px-2 py-1 rounded-full bg-paw-green/10 text-paw-green">
                        {a.status}
                      </span>
                    </div>
                  ))}
                  {!recent.length && <p className="text-sm text-paw-muted">No appointments yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AdminShell>
  );
}
