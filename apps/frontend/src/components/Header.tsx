// import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, MapPin, Menu, Search, User, X } from 'lucide-react'
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const auth = useAuth();

  return (
    <>
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl">SportBooking</h1>
                <p className="text-xs text-muted-foreground">Réservation d'équipements sportifs</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden sm:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    type="search"
                    placeholder="Rechercher un équipement, une ville, un sport..."
                    // value={searchQuery}
                    // onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden sm:flex items-center space-x-4">
              {auth.user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/account">
                    <User className="w-4 h-4 mr-2" />
                    Mon compte
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth/login">
                    <User className="w-4 h-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
              )}
            </div>

            <button
                onClick={() => setIsMobileNavOpen(true)}
                className="block sm:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
      <aside
          className={`fixed top-0 left-0 h-full w-80 bg-background text-primary shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex sm:hidden flex-col ${
              isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
              onClick={() => setIsMobileNavOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
              to="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors mb-2"
              activeProps={{
                className:
                    'flex items-center gap-3 p-3 rounded-lg bg-secondary transition-colors mb-2',
              }}
          >
            <Home size={20} />
            <span className="font-medium">Accueil</span>
          </Link>
        </nav>
      </aside>
    </>
  );
}
