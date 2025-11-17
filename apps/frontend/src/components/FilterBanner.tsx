import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Slider } from '~/components/ui/slider'
import { cn } from '~/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, Check } from 'lucide-react'
import { useState } from 'react'

const sportTypes = [
  { label: 'Football', value: 'football' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Volleyball', value: 'volleyball' },
]

const sortOptions = [
  { label: 'Note', value: 'rating' },
  { label: 'Prix', value: 'price' },
  { label: 'Distance', value: 'distance' },
]

interface City {
  label: string
  value: string
}

// Mock cities data - to be replaced with real API data
const cities: City[] = [
  { label: 'Paris', value: 'paris' },
  { label: 'Lyon', value: 'lyon' },
  { label: 'Marseille', value: 'marseille' },
  { label: 'Bordeaux', value: 'bordeaux' },
]

export interface FilterBannerProps {
  onFiltersChange?: (filters: FilterValues) => void
}

export interface FilterValues {
  sportType: string
  city: string
  date: Date | undefined
  sortBy: string
  priceRange: number[]
}

const initialFilters: FilterValues = {
  sportType: '',
  city: '',
  date: undefined,
  sortBy: 'rating',
  priceRange: [0, 100],
}

export function FilterBanner({ onFiltersChange }: FilterBannerProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters)
  const [open, setOpen] = useState(false)

  const handleFiltersChange = (newFilters: Partial<FilterValues>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange?.(updatedFilters)
  }

  const resetFilters = () => {
    setFilters(initialFilters)
    onFiltersChange?.(initialFilters)
  }

  return (
    <div className="w-full bg-white shadow-md p-4 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sport Type Select */}
        <div className="flex-1 min-w-[200px]">
          <Select
            value={filters.sportType}
            onValueChange={(value: string) =>
              handleFiltersChange({ sportType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de sport" />
            </SelectTrigger>
            <SelectContent>
              {sportTypes.map(sport => (
                <SelectItem key={sport.value} value={sport.value}>
                  {sport.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Search */}
        <div className="flex-1 min-w-[200px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {filters.city
                  ? cities.find(city => city.value === filters.city)?.label
                  : 'Sélectionner une ville...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Rechercher une ville..." />
                <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                <CommandGroup>
                  {cities.map(city => (
                    <CommandItem
                      key={city.value}
                      value={city.value}
                      onSelect={(value: string) => {
                        handleFiltersChange({ city: value })
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          filters.city === city.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {city.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Picker */}
        <div className="flex-1 min-w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? (
                  format(filters.date, 'dd/MM/yyyy', { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date: Date | null) =>
                  handleFiltersChange({ date: date || undefined })
                }
                locale={fr}
                initialFocus
                required={true}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort Select */}
        <div className="flex-1 min-w-[200px]">
          <Select
            value={filters.sortBy}
            onValueChange={(value: string) =>
              handleFiltersChange({ sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="flex-1 min-w-[200px]">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">
                Prix: {filters.priceRange[0]}€ - {filters.priceRange[1]}€
              </span>
            </div>
            <Slider
              defaultValue={filters.priceRange}
              max={100}
              step={1}
              onValueChange={(value: number[]) =>
                handleFiltersChange({ priceRange: value })
              }
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={resetFilters}
          className="min-w-[120px]"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}
