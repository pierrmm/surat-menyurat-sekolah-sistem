"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import {
  IconArrowLeft,
  IconSettings,
  IconUserBolt,
  IconDashboard,
  IconUsers,
  IconFileText,
  IconPlus,
} from "@tabler/icons-react";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/app/components/LoginForm";
import Link from "next/link";
import { motion } from "framer-motion";

// Add this interface at the top of the file
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Rest of the file remains the same...

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  const isAdmin = user.role === 'admin';

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    // Only show Users link for admin
    ...(isAdmin ? [{
      label: "Users",
      href: "/users",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    }] : []),
    {
      label: "Pengajuan Surat",
      href: "/surat",
      icon: (
        <IconFileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: signOut,
    },
  ];

  // Data untuk aktivitas terbaru
  const adminActivities = [
    { 
      id: 1,
      title: 'Surat Izin Kegiatan Ekstrakurikuler', 
      user: 'Ahmad Rizki',
      status: 'pending',
      time: '2 jam yang lalu' 
    },
    { 
      id: 2,
      title: 'Surat Permohonan Cuti', 
      user: 'Siti Nurhaliza',
      status: 'pending',
      time: '4 jam yang lalu' 
    },
    { 
      id: 3,
      title: 'Surat Dispensasi Ujian', 
      user: 'Budi Santoso',
      status: 'approved',
      time: '1 hari yang lalu' 
    },
  ];

  const userActivities = [
    { 
      id: 1,
      title: 'Surat Izin Tidak Masuk', 
      status: 'approved',
      time: '2 hari yang lalu' 
    },
    { 
      id: 2,
      title: 'Surat Dispensasi Ujian', 
      status: 'pending',
      time: '3 hari yang lalu' 
    },
    { 
      id: 3,
      title: 'Surat Permohonan Pindah Kelas', 
      status: 'rejected',
      time: '1 minggu yang lalu' 
    },
  ];

  const activities = isAdmin ? adminActivities : userActivities;

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.name || user.email,
                href: "#",
                icon: (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center">
                    <IconUserBolt className="h-4 w-4" />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                Sistem Surat Menyurat Sekolah
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Role: {user.role} | {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <Link
                  href="/surat/create"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <IconPlus className="h-4 w-4" />
                  Ajukan Surat
                </Link>
              )}
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex flex-col gap-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  {isAdmin ? 'Total Pengajuan' : 'Pengajuan Saya'}
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {isAdmin ? '156' : '12'}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Disetujui
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {isAdmin ? '89' : '8'}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                  Menunggu Persetujuan
                </h3>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {isAdmin ? '23' : '3'}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Ditolak
                </h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {isAdmin ? '44' : '1'}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                  {isAdmin ? 'Pengajuan Terbaru' : 'Status Pengajuan Saya'}
                </h2>
                <Link
                  href="/surat"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'approved' ? 'bg-green-500' : 
                        activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                          {activity.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          {isAdmin && 'user' in activity && (
                            <>
                              <span>oleh {activity.user}</span>
                                                            <span>•</span>
                            </>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {activity.status === 'approved' ? 'Disetujui' :
                             activity.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Logo Components
const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        SMS Sistem
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};