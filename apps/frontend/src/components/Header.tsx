import React, { useState, useEffect } from 'react'
import { Home, MapPin, Menu, Search, User, X, Sparkles } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useAuth } from '~/hooks/use-auth'
import { UserDropdown } from '~/components/user/user-dropdown'
import { motion, AnimatePresence } from 'motion/react'

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [filterType, setFilterType] = useState<'name' | 'sport' | 'city'>(
    'name'
  )
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const search = useSearch({ strict: false })

  const [inputValue, setInputValue] = useState(
    search?.name || search?.sport || search?.city || ''
  )
  const navigate = useNavigate()

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate({
        to: '.',
        search: { [filterType]: inputValue },
        replace: true,
      })
    }
  }

  const { user } = useAuth()

  const filterLabels = {
    name: 'Nom',
    sport: 'Sport',
    city: 'Ville',
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-md border-b border-border/50'
            : 'bg-background border-b border-border'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <MapPin className="w-5 h-5 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%', opacity: 0 }}
                  whileHover={{ x: '100%', opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span
                  className="font-bold text-lg tracking-tight group-hover:text-secondary transition-colors duration-200"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  SportBooking
                </span>
                <span className="text-[10px] text-muted-foreground tracking-wide uppercase">
                  Réservez votre terrain
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <motion.div
                animate={{
                  scale: isSearchFocused ? 1.02 : 1,
                  boxShadow: isSearchFocused
                    ? '0 8px 30px -10px oklch(0.58 0.22 255 / 0.25)'
                    : '0 2px 10px -5px oklch(0 0 0 / 0.1)',
                }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center bg-muted/50 rounded-xl overflow-hidden border border-border/50 hover:border-secondary/30 transition-colors duration-200"
              >
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={e =>
                      setFilterType(e.target.value as 'name' | 'sport' | 'city')
                    }
                    className="h-full px-4 py-2.5 bg-transparent text-sm font-medium outline-none cursor-pointer border-r border-border/50 text-foreground appearance-none pr-8"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    <option value="name">Nom</option>
                    <option value="sport">Sport</option>
                    <option value="city">Ville</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <Input
                    type="search"
                    placeholder={`Rechercher par ${filterLabels[filterType].toLowerCase()}...`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full py-2.5 px-4 border-none bg-transparent shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate({
                      to: '.',
                      search: { [filterType]: inputValue },
                      replace: true,
                    })
                  }
                  className="m-1.5 p-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors duration-200"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
              </motion.div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <UserDropdown user={user} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                  >
                    <Link to="/login" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Connexion
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileNavOpen(true)}
              className="flex md:hidden p-2 hover:bg-muted rounded-xl transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </motion.button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="flex items-center bg-muted/50 rounded-xl overflow-hidden border border-border/50">
              <select
                value={filterType}
                onChange={e =>
                  setFilterType(e.target.value as 'name' | 'sport' | 'city')
                }
                className="px-3 py-2.5 bg-transparent text-sm font-medium outline-none cursor-pointer border-r border-border/50"
              >
                <option value="name">Nom</option>
                <option value="sport">Sport</option>
                <option value="city">Ville</option>
              </select>
              <Input
                type="search"
                placeholder={`Rechercher...`}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 py-2.5 px-3 border-none bg-transparent shadow-none focus-visible:ring-0"
              />
              <button
                onClick={() =>
                  navigate({
                    to: '.',
                    search: { [filterType]: inputValue },
                    replace: true,
                  })
                }
                className="m-1.5 p-2 rounded-lg bg-secondary text-white"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-background z-50 md:hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Menu
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Home className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <span
                        className="font-semibold block"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        Accueil
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Découvrir les équipements
                      </span>
                    </div>
                  </Link>
                </motion.div>

                {!user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2"
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileNavOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span
                          className="font-semibold block"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Connexion
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Accédez à votre compte
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Footer decoration */}
              <div className="p-5 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Réservez en quelques clics</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
