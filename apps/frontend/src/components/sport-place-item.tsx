import React, {useState} from "react"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import {Button} from "~/components/ui/button"
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "~/components/ui/dialog"
import {Input} from "~/components/ui/input"
import {Label} from "~/components/ui/label"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "~/components/ui/select"
import {Calendar, Clock, Users} from "lucide-react"
import {SportEquipment} from "~/lib/queries/sport-equipments";
import {useMutation} from "@tanstack/react-query";
import {createReservationMutationOptions} from "~/lib/queries/reservation";

type SportPlaceItemProps = {
	equipment: SportEquipment;
};

export function SportPlaceItem({ equipment }: SportPlaceItemProps) {
	const [date, setDate] = useState<string>("")
	const [timeSlot, setTimeSlot] = useState<string>("")
	const [participants, setParticipants] = useState<number>(1)
	const [loading, setLoading] = useState<boolean>(false)
	const [success, setSuccess] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const mutation = useMutation(createReservationMutationOptions());

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await mutation.mutateAsync({
				payload: {
					sportEquipmentId: equipment.id,  // adapte à ton backend
					startDate: date,
					endDate: date,                    // ou autre selon ton API
					timeSlot,
					participants,
				},
			});

			setSuccess("Réservation confirmée !");
		} catch (err: any) {
			setError("Erreur lors de la réservation." + (err.message || ""));
		} finally {
			setLoading(false);
		}
	}


	return (
		<Card
			className="overflow-hidden justify-items-start flex flex-col sm:flex-row shadow-sm hover:shadow-md transition">
			{/* Image */}
			<div className="sm:w-1/3 relative">
				<img
					src={
						equipment.image ||
						"https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60"
					}
					alt={equipment.nom}
					className="object-cover h-48 sm:h-full w-full"
				/>
				<div
					className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1 rounded-lg shadow-sm text-sm">
					{equipment.type}
				</div>
			</div>

			{/* Content */}
			<CardContent className="flex-1 flex flex-col justify-between p-6">
				<div className="flex flex-1 items-start flex-col">
					<CardHeader className="p-0 flex w-full mb-2">
						<CardTitle className="text-xl">{equipment.nom}</CardTitle>
					</CardHeader>
					<p className="text-sm text-muted-foreground mb-1">📍 {equipment.address}</p>
					<p className="text-gray-700 text-sm mb-3">{equipment.description || "Aucune description disponible."}</p>

					<ul className="text-sm flex items-start gap-4 text-gray-600">
						<li>👥 Capacité: {equipment.capacite ?? "?"}</li>
						<li>🏙️ {equipment.postalCode} {equipment.libBdv}</li>
					</ul>
				</div>

				<div className="border-t border-gray-200 my-4"/>

				<div className="flex gap-3 mt-5">
					{/* Voir détails */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">Voir détails</Button>
						</DialogTrigger>
						<DialogContent className="max-w-lg">
							<DialogHeader>
								<DialogTitle>{equipment.nom}</DialogTitle>
								<DialogDescription>{equipment.description}</DialogDescription>
							</DialogHeader>
							<img
								src={
									equipment.image ||
									"https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=60"
								}
								alt={equipment.nom}
								className="w-full h-60 object-cover my-4 rounded"
							/>
							<p>📍 {equipment.address}</p>
							<p>🏙️ {equipment.postalCode} {equipment.libBdv}</p>
							<p>👥 Capacité: {equipment.capacite ?? "?"}</p>
						</DialogContent>
					</Dialog>

					{/* Réserver */}
					<Dialog>
						<DialogTrigger asChild>
							<Button className="bg-black hover:bg-gray-700">Réserver maintenant</Button>
						</DialogTrigger>

						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle>Réserver {equipment.nom}</DialogTitle>
								<DialogDescription>
									Complétez les informations ci-dessous pour finaliser votre réservation.
								</DialogDescription>
							</DialogHeader>
							<form className="space-y-4 mt-4" onSubmit={handleSubmit}>
								<div className="grid gap-2">
									<div className="flex gap-2">
										<Calendar className="w-4 h-4"/>
										<Label htmlFor="date">Date</Label>
									</div>
									<Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required/>
								</div>

								<div className="grid gap-2">
									<div className="flex gap-2">
										<Clock className="w-4 h-4"/>
										<Label htmlFor="time">Créneau horaire</Label>
									</div>
									<Select onValueChange={(v) => setTimeSlot(v)} value={timeSlot}>
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
										<Users className="w-4 h-4"/>
										<Label htmlFor="participants">Nombre de participants</Label>
									</div>
									<Input id="participants" type="number" min={1} value={participants}
												 onChange={e => setParticipants(Number(e.target.value))}/>
								</div>

								{error && <p className="text-sm text-red-600">{error}</p>}
								{success && <p className="text-sm text-green-600">{success}</p>}

								<DialogFooter className="mt-6 flex justify-end gap-2">
									<DialogTrigger asChild>
										<Button variant="outline">Annuler</Button>
									</DialogTrigger>
									<Button type="submit" className="bg-black hover:bg-gray-700" disabled={loading}>
										{loading ? "Envoi..." : "Confirmer la réservation"}
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
