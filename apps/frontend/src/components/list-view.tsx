import React from "react"
import { SportPlaceItem } from "./sport-place-item"

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

interface ListViewProps {
	sportPlaces?: SportPlace[]
}

export function ListView({ sportPlaces }: ListViewProps) {
	if (!sportPlaces || sportPlaces.length === 0) {
		return (
			<div className="text-muted-foreground italic p-4 text-center">
				Aucun lieu disponible.
			</div>
		)
	}

	return (
		<div className="grid gap-6">
			{sportPlaces.map((place, index) => (
				<SportPlaceItem key={index} place={place} />
			))}
		</div>
	)
}
