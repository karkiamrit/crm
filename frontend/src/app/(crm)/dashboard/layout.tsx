"use client"
import React from 'react';

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import RootLayout from '@/app/layout';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      <div>
        <Header />
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className=" w-full md:pt-16">
            {children}
          </main>
        </div>
      </div>
    </RootLayout>
  );
}