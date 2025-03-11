"use client"

import { getAwardColor, getOrdinalSuffix } from "@/app/functions"
import { TbAwardFilled } from "react-icons/tb"
import { createClient } from "@/utils/supabase/client"
import { handleDate } from "@/app/functions"
import useSWR from "swr"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GiTrophyCup } from "react-icons/gi"
import { BiSolidTimeFive } from "react-icons/bi"

// Define types for our data
type Player = {
  rank: number
  player: string
  percentageChange: string | number
  playerId: string
}

// Define the columns
const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "rank",
    header: () => <div className="text-center">Rank</div>,
    cell: ({ row }) => {
      const rank = row.getValue("rank") as number
      const percentageChange = row.getValue("percentageChange") as string
      const hasWeightLogged = percentageChange !== "No weight logged"

      return (
        <div className="flex items-center justify-center gap-2">
          {rank <= 3 && hasWeightLogged ? (
            <>
              <div
                className={`rounded-full p-2 ${getAwardColor(
                  rank
                )} bg-opacity-10`}
              >
                <TbAwardFilled className={`w-5 h-5 ${getAwardColor(rank)}`} />
              </div>
              <span className="font-medium">{getOrdinalSuffix(rank)}</span>
            </>
          ) : (
            <span className="text-gray-500 font-medium">
              {hasWeightLogged ? getOrdinalSuffix(rank) : "-"}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "player",
    header: "Player",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("player")}</div>
    ),
  },
  {
    accessorKey: "percentageChange",
    header: () => <div className="text-right">Progress</div>,
    cell: ({ row }) => {
      const value = row.getValue("percentageChange") as string
      const isPositive = !value.includes("-") && value !== "No weight logged"

      return (
        <div
          className={`text-right font-medium ${
            value === "No weight logged"
              ? "text-gray-500"
              : isPositive
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {value}
        </div>
      )
    },
  },
  {
    accessorKey: "prize",
    header: () => <div className="text-right">Prize</div>,
    cell: ({ row }) => {
      const rank = row.getValue("rank") as number
      const percentageChange = row.getValue("percentageChange") as string
      const hasWeightLogged = percentageChange !== "No weight logged"

      if (!hasWeightLogged || rank > 3)
        return <div className="text-right">-</div>

      const prizeStyles = {
        1: "text-yellow-500",
        2: "text-gray-400",
        3: "text-amber-700",
      }

      const prizes = {
        1: "$30.00",
        2: "$20.00",
        3: "$10.00",
      }

      return (
        <div
          className={`text-right font-medium ${
            prizeStyles[rank as keyof typeof prizeStyles]
          }`}
        >
          {prizes[rank as keyof typeof prizes]}
        </div>
      )
    },
  },
]

export default function CompetitionPage(props: any) {
  const supabase = createClient()

  const {
    data: competitionData,
    error,
    isLoading,
  } = useSWR("/competitions/name", async () => {
    const { data } = await supabase
      .from("competitions")
      .select(
        "*, competitions_players(*, profiles(id,first_name, last_name, weight_tracker(weight, date_entry)))"
      )
      .eq("id", props.params.id)
    return data
  })
  console.log(competitionData)

  function getCreatedBy(competition: any) {
    const creator = competition.competitions_players.find(
      (player: any) => player.player_id === competition.created_by
    )

    return creator?.profiles
      ? `${creator.profiles.first_name} ${creator.profiles.last_name}`
      : "Unknown"
  }

  // const handleDaysLeft = (date: any | number | Date) => {
  //   const today = new Date()
  //   const competitionEndDate: any = new Date(date)
  //   const timeDifference = competitionEndDate.getTime() - today.getTime()
  //   const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24))
  //   return daysLeft
  // }

  function getInitialWeight(player: any, competitionData: any) {
    if (!player?.profiles?.weight_tracker?.length) {
      return 0
    }
    const closestInitialDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          new Date(b.date_entry).getTime() -
            new Date(competitionData.date_ending).getTime()
        ) <
        Math.abs(
          new Date(a.date_entry).getTime() -
            new Date(competitionData.date_started).getTime()
        )
          ? a
          : b
    )
    return closestInitialDate.weight
  }

  function getCurrentWeight(player: any, competitionData: any) {
    if (!player?.profiles?.weight_tracker?.length) {
      return 0
    }
    const closestCurrentDate = player.profiles.weight_tracker.reduce(
      (a: any, b: any) =>
        Math.abs(
          new Date(b.date_entry).getTime() -
            new Date(competitionData.date_started).getTime()
        ) <
        Math.abs(
          new Date(a.date_entry).getTime() -
            new Date(competitionData.date_ending).getTime()
        )
          ? b
          : a
    )
    return closestCurrentDate.weight
  }

  // Calculate player differences
  const difference: Player[] = []
  if (competitionData) {
    competitionData.forEach((competition) => {
      competition.competitions_players.forEach((player: any) => {
        const initialWeight = getInitialWeight(player, competition)
        const currentWeight = getCurrentWeight(player, competition)
        let percentageChange

        if (initialWeight === 0 || currentWeight === 0) {
          percentageChange = "No weight logged"
        } else {
          const weightChange = currentWeight - initialWeight
          percentageChange =
            ((weightChange / initialWeight) * 100).toFixed(2) + "%"
        }

        difference.push({
          rank: 0, // Will be determined by sort order
          player: `${player.profiles.first_name} ${player.profiles.last_name}`,
          percentageChange,
          playerId: player.profiles.id,
        })
      })
    })
  }

  // Sort players by percentage change
  const sortedData = difference
    .sort((a: any, b: any) => {
      if (a.percentageChange === "No weight logged") return 1
      if (b.percentageChange === "No weight logged") return -1
      return parseFloat(b.percentageChange) - parseFloat(a.percentageChange)
    })
    .map((player, index) => ({
      ...player,
      rank:
        player.percentageChange === "No weight logged"
          ? difference.length
          : index + 1,
    }))

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (error) return <div className="text-center mt-20">Failed to load</div>
  if (isLoading)
    return (
      <div className="text-center mt-20">
        <span className="text-gray-700">Loading competition...</span>
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg shadow-lg p-6">
      {competitionData?.map((competition, index) => (
        <div key={index} className="pb-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {competition.name}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="text-lg font-semibold">
                {handleDate(competition.date_started)}
              </p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="text-lg font-semibold">
                {handleDate(competition.date_ending)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <GiTrophyCup className="h-5 w-5 text-yellow-500" />
              <AlertTitle className="text-yellow-500">1st Place</AlertTitle>
              <AlertDescription className="text-black">$30.00</AlertDescription>
            </Alert>
            <Alert className="border-gray-400/50 bg-gray-400/10">
              <GiTrophyCup className="h-5 w-5 text-gray-400" />
              <AlertTitle className="text-gray-400">2nd Place</AlertTitle>
              <AlertDescription className="text-black">$20.00</AlertDescription>
            </Alert>
            <Alert className="border-amber-700/50 bg-amber-700/10">
              <GiTrophyCup className="h-5 w-5 text-amber-700" />
              <AlertTitle className="text-amber-700">3rd Place</AlertTitle>
              <AlertDescription className="text-black">$10.00</AlertDescription>
            </Alert>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-base font-semibold"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={row.index < 3 ? "bg-muted/30" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-2 flex">
            <span className="text-xs text-gray-500">
              Competition created by {getCreatedBy(competition)} on{" "}
              {handleDate(competition.created_at)}
            </span>
            {/* <span className="text-xs text-gray-500">
              Last updated on January 28th, 2024 at 10:00 PM
            </span> */}
          </div>

          {competition.rules && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <BiSolidTimeFive className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold">Competition Rules</h3>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
                <div className="prose prose-blue max-w-none text-gray-700">
                  {competition.rules
                    .split("\n")
                    .map((rule: string, index: number) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {rule}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
