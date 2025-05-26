"use client"

import { AppNavbar, NavItem } from '@/components/(core)/AppNavbar';
import {
  Home,
  LayoutDashboard,
  History,
  BookOpen,
  CloudSun,
  MapIcon,
  Info,
  Wind
} from 'lucide-react';

export default function Navbar() {
  const navigationItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    // { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { id: 'predictions', label: 'Predictions', href: '/predictions', icon: CloudSun },
    { id: 'history', label: 'History', href: '/history', icon: History },
    { id: 'map', label: 'Map', href: '/map', icon: MapIcon },
    { id: 'about', label: 'About', href: '/about', icon: Info },
    { id: 'docs', label: 'Documentation', href: '/redoc', icon: BookOpen, external: true },
  ];

  return (
    <div>
      <AppNavbar
        navItems={navigationItems}
        brandName="Global Air Quality Monitor"
        brandHref="/"
        brandIcon={Wind}
      />
    </div>
  );
}