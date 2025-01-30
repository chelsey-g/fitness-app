import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"
import { handleDate, calculateDaysLeft } from "@/app/functions"

interface Competition {
  id: string
  competition_id: string
  competitions: {
    name: string
    date_ending: string
  }
}

interface CarouselOrientationProps {
  competitions: Competition[]
}

export default function CarouselOrientation({
  competitions,
}: CarouselOrientationProps) {
  if (!competitions || competitions.length === 0) {
    return <p className="text-gray-600 italic">No active competitions found.</p>
  }

  return (
    <div className="relative max-w-xs mx-auto">
      <Carousel className="w-full">
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
      </Carousel>
      <span className="block text-center text-xs text-gray-500 mt-2">
        Swipe over to see more competitions
      </span>
    </div>
  )
}
