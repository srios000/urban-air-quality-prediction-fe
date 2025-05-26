"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/(utility)/themeToggle";
import { Home, LayoutDashboard, BarChart3, History, Settings, LucideIcon, Wind } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
}

export interface AppNavbarProps {
  navItems: NavItem[];
  brandName?: string;
  brandHref?: string;
  brandIcon?: LucideIcon;
}

export function AppNavbar({
  navItems,
  brandName = "Global AQI Monitor",
  brandHref = "/",
  brandIcon: BrandIcon,
}: AppNavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-card text-card-foreground border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href={brandHref} className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
              {BrandIcon && <BrandIcon className="h-6 w-6" />}
              <span>{brandName}</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <ThemeToggle />
            <div className="md:hidden ml-3">
              <button>Menu</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;