import React from "react"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select"
import { Calendar, Clock, Users } from "lucide-react"

type SportPlace = {
	title: string
	price: string
	image: string
	location: string
	desc: string
	limit: string
	rating: string
	slots: string
}

interface SportPlaceItemProps {
	place: SportPlace
}

export function SportPlaceItem({ place }: SportPlaceItemProps) {
	return (
		<Card className="overflow-hidden justify-items-start flex flex-col sm:flex-row shadow-sm hover:shadow-md transition">
			{/* Image */}
			<div className="sm:w-1/3 relative">
				<img
					src={place.image}
					alt={place.title}
					className="object-cover h-48 sm:h-full w-full"
				/>
				<div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1 rounded-lg shadow-sm text-sm">
					💰 {place.price}
				</div>
			</div>

			{/* Content */}
			<CardContent className="flex-1 flex flex-col justify-between p-6">
				<div className="flex flex-1 items-start flex-col">
					<CardHeader className="p-0 flex w-full mb-2">
						<CardTitle className="text-xl">{place.title}</CardTitle>
					</CardHeader>
					<p className="text-sm text-muted-foreground mb-1">📍 {place.location}</p>
					<p className="text-gray-700 text-sm mb-3">{place.desc}</p>

					<ul className="text-sm flex items-start gap-4 text-gray-600">
						<li>👥 {place.limit}</li>
						<li>⭐ {place.rating}</li>
						<li>📅 {place.slots}</li>
					</ul>
				</div>

				<div className="border-t border-gray-200 my-4" />

				<div className="flex gap-3 mt-5">
					{/* Voir détails */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Voir détails</Button>
						</DialogTrigger>
						<DialogContent className="max-w-lg">
							<DialogHeader>
								<DialogTitle>{place.title}</DialogTitle>
								<DialogDescription>{place.desc}</DialogDescription>
							</DialogHeader>
							<img
								src={place.image}
								alt={place.title}
								className="w-full h-60 object-cover my-4 rounded"
							/>
							<p>💰 Prix: {place.price}</p>
							<p>📍 Lieu: {place.location}</p>
							<p>👥 {place.limit} | ⭐ {place.rating} | 📅 {place.slots}</p>
						</DialogContent>
					</Dialog>

					{/* Réserver maintenant */}
					<Dialog>
						<DialogTrigger asChild>
							<Button className="bg-black hover:bg-gray-700">
								Réserver maintenant
							</Button>
						</DialogTrigger>

						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Réserver {place.title}</DialogTitle>
								<DialogDescription>
									Complétez les informations ci-dessous pour finaliser votre réservation.
								</DialogDescription>
							</DialogHeader>
							<form className="space-y-4 mt-4">
								<div>
									<p className="font-semibold text-lg">{place.title}</p>
									<p className="text-sm text-muted-foreground">{place.location}</p>
									<p className="mt-1 text-gray-800">{place.price}</p>
								</div>

								<div className="grid gap-2">
									<div className="flex gap-2">
										<Calendar className="w-4 h-4" />
										<Label htmlFor="date">Date</Label>
									</div>
									<Input id="date" type="date"/>
								</div>

								<div className="grid gap-2">
									<div className="flex gap-2">
										<Clock className="w-4 h-4" />
										<Label htmlFor="time">Sélectionner un créneau</Label>
									</div>
									<Select>
										<SelectTrigger id="time">
											<SelectValue placeholder="Choisir un créneau"/>
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="10h-12h">10h - 12h</SelectItem>
											<SelectItem value="12h-14h">12h - 14h</SelectItem>
											<SelectItem value="14h-16h">14h - 16h</SelectItem>
											<SelectItem value="16h-18h">16h - 18h</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="grid gap-2">
									<div className="flex gap-2">
										<Users className="w-4 h-4" />
										<Label htmlFor="participants">Nombre de participants</Label>
									</div>
									<Input id="participants" type="number" min={1} defaultValue={1}/>
								</div>

								<div className="grid gap-2">
									<Label htmlFor="info">Informations complémentaires</Label>
									<Textarea
										id="info"
										placeholder="Informations complémentaires sur votre réservation..."
									/>
								</div>

								<DialogFooter className="mt-6 flex justify-end gap-2">
									<DialogTrigger asChild>
										<Button variant="outline">Annuler</Button>
									</DialogTrigger>
									<Button type="submit" className="bg-black hover:bg-gray-700">
										Confirmer la réservation
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	)
}
