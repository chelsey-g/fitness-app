import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { handleDate, calculateDaysLeft } from "@/app/functions"

export default function CarouselOrientation({ competitions }) {
  if (!competitions || competitions.length === 0) {
    return <p className="text-gray-600 italic">No active competitions found.</p>
  }

  return (
    <div className="relative max-w-xs mx-auto">
      <Carousel className="w-full">
        <CarouselPrevious className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-snd-bkg text-white rounded-full p-2 shadow-md"></CarouselPrevious>
        <CarouselContent>
          {competitions.map((competition) => (
            <CarouselItem key={competition.id}>
              <div className="p-4">
                <Card className="w-full text-white border-none">
                  <Link
                    href={`/competitions/${competition.competition_id}`}
                    className="hover:opacity-80"
                  >
                    <CardContent className="text-xs text-logo-green">
                      {competition.competitions.name}
                      <p className="text-xs mt-1 text-white">
                        {calculateDaysLeft(
                          competition.competitions.date_ending
                        )}{" "}
                        days left
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-snd-bkg text-white rounded-full p-2 shadow-md">
          &gt;
        </CarouselNext>
      </Carousel>
    </div>
  )
}
