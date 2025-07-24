"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Play, History, Dumbbell } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/start-workout", label: "Workout", icon: Play },
  { href: "/workout-history", label: "History", icon: History },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LevelUp</h1>
                <p className="text-xs text-zinc-400">Fitness Tracker</p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-700/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-gradient-to-r from-orange-500/20 to-pink-600/20 border border-orange-500/30 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                    }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
