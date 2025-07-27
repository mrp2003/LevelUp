"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Calendar, Play, History, User, Target, Dumbbell, Menu, X, Zap } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/start-workout", label: "Workout", icon: Play },
  { href: "/workout-history", label: "History", icon: History },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/muscles", label: "Muscles", icon: Zap },
  { href: "/profile", label: "Profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 theme-gradient rounded-xl">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LevelUp</h1>
                <p className="text-xs text-zinc-400">Fitness Tracker</p>
              </div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Menu className="h-6 w-6 text-zinc-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Page Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden animate-in fade-in duration-300">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-zinc-900/95 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeMobileMenu}
          />

          {/* Menu Content */}
          <div className="relative h-full flex flex-col animate-in slide-in-from-top-4 duration-500 ease-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-700/50 animate-in slide-in-from-top-2 duration-700 delay-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 theme-gradient rounded-xl">
                  <Dumbbell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">LevelUp</h1>
                  <p className="text-xs text-zinc-400">Fitness Tracker</p>
                </div>
              </div>

              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="grid grid-cols-2 gap-8 max-w-md">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex flex-col items-center space-y-3 p-6 transition-all duration-200 hover:scale-105 animate-in slide-in-from-bottom-4 duration-500 ease-out`}
                      style={{ animationDelay: `${200 + index * 100}ms` }}
                    >
                      <Icon className={`h-10 w-10 ${isActive ? "theme-text" : "text-zinc-400"}`} />
                      <span className={`text-lg font-medium ${isActive
                        ? "theme-text"
                        : "text-zinc-400"
                        }`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Menu Footer */}
            <div className="p-6 border-t border-zinc-700/50 animate-in slide-in-from-bottom-2 duration-700 delay-300">
              <p className="text-center text-zinc-500 text-sm">
                Ready to level up your fitness journey?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Bottom Navigation - Hidden on Mobile */}
      <nav className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-700/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 focus:outline-none hover:bg-zinc-800"
                >
                  <Icon className={`h-5 w-5 ${isActive ? "theme-text" : "text-zinc-400"}`} />
                  <span className={`text-xs mt-1 font-medium ${isActive ? "theme-text" : "text-zinc-400"}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
