"use client"

import { getAwardColor, getOrdinalSuffix } from "@/app/functions"
import { TbAwardFilled } from "react-icons/tb"
import { createClient } from "@/utils/supabase/client"
// import { handleDate } from "@/app/functions"
import useSWR from "swr"
import { useAuth } from "@/contexts/AuthContext"
import dayjs from "dayjs"
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
import { useRouter } from "next/navigation"
import LeaveCompetition from "@/components/LeaveCompetition"

interface Player {
  rank: number
  player: string
  percentageChange: string | number
  playerId: string
}

interface Competition {
  id: string
  name: string
  date_started: string
  date_ending: string
  created_by: string
  created_at: string
  has_prizes: boolean
  prizes?: Array<{
    place: number
    type: string
    reward: string | number
  }>
  rules?: string
  competitions_players: Array<{
    player_id: string
    profiles: {
      id: string
      first_name: string
      last_name: string
      weight_tracker: Array<{
        weight: number
        date_entry: string
      }>
    }
  }>
}

export default function CompetitionPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()

  const {
    data: competitionData,
    error,
    isLoading,
    mutate
  } = useSWR<Competition[]>(
    user ? `/competitions/${params.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select(`
          *,
          competitions_players(
            *,
            profiles(
              id,
              first_name,
              last_name,
              weight_tracker(weight, date_entry)
            )
          )
        `)
        .eq("id", params.id)
        .single()
      if (error) throw error
      return data ? [data] : []
    }
  )

  // Prepare all data and columns regardless of loading/error state
  const difference: Player[] = []
  if (competitionData) {
    competitionData.forEach((competition) => {
      competition.competitions_players.forEach((player) => {
        const initialWeight = getInitialWeight(player, competition)
        const currentWeight = getCurrentWeight(player, competition)
        let percentageChange
        if (initialWeight === 0 || currentWeight === 0) {
          percentageChange = "-"
        } else {
          const weightChange = currentWeight - initialWeight
          percentageChange =
            ((weightChange / initialWeight) * 100).toFixed(2) + "%"
        }
        difference.push({
          rank: 0,
          player: `${player.profiles.first_name} ${player.profiles.last_name}`,
          percentageChange,
          playerId: player.profiles.id,
        })
      })
    })
  }

  const sortedData = difference
    .sort((a, b) => {
      if (a.percentageChange === "-") return 1
      if (b.percentageChange === "-") return -1
      return parseFloat(b.percentageChange as string) - parseFloat(a.percentageChange as string)
    })
    .map((player, index) => ({
      ...player,
      rank: player.percentageChange === "-" ? difference.length : index + 1,
    }))

  const prizeColumn: ColumnDef<Player> = {
    accessorKey: "prize",
    header: () => <div className="text-right">Prize</div>,
    cell: ({ row }) => {
      const rank = row.getValue("rank") as number
      const percentageChange = row.getValue("percentageChange") as string
      const hasWeightLogged = percentageChange !== "-"
      if (!hasWeightLogged || rank > 3)
        return <div className="text-right">-</div>
      const prizeStyles = {
        1: "text-yellow-500",
        2: "text-gray-400",
        3: "text-amber-700",
      }
      const prize = competitionData?.[0]?.prizes?.find(
        (p) => p.place === rank
      )
      return (
        <div
          className={`text-right font-medium ${
            prizeStyles[rank as keyof typeof prizeStyles]
          }`}
        >
          {prize?.type === "money" ? `$${prize.reward}` : prize?.reward}
        </div>
      )
    },
  }

  const columns: ColumnDef<Player>[] = [
    {
      accessorKey: "rank",
      header: () => <div className="text-center">Rank</div>,
      cell: ({ row }) => {
        const rank = row.getValue("rank") as number
        const percentageChange = row.getValue("percentageChange") as string
        const hasWeightLogged = percentageChange !== "-"
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
        const isPositive = !value.includes("-") && value !== "-"
        return (
          <div
            className={`text-right font-medium ${
              value === "-"
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
    ...(competitionData?.[0]?.has_prizes ? [prizeColumn] : []),
  ]

  // Always call hooks before any return
  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Helper functions (must be defined before use)
  function getCreatedBy(competition: Competition) {
    const creator = competition.competitions_players.find(
      (player) => player.player_id === competition.created_by
    )
    return creator?.profiles
      ? `${creator.profiles.first_name} ${creator.profiles.last_name}`
      : "Unknown"
  }
  function getInitialWeight(player: Competition['competitions_players'][0], competitionData: Competition) {
    if (!player?.profiles?.weight_tracker?.length) {
      return 0
    }
    const startDate = dayjs(competitionData.date_started)
    return player.profiles.weight_tracker.reduce((closest, current) => {
      const currentDate = dayjs(current.date_entry)
      const closestDate = dayjs(closest.date_entry)
      return currentDate.diff(startDate) < closestDate.diff(startDate) ? current : closest
    }).weight
  }
  function getCurrentWeight(player: Competition['competitions_players'][0], competitionData: Competition) {
    if (!player?.profiles?.weight_tracker?.length) {
      return 0
    }
    const endDate = dayjs(competitionData.date_ending)
    return player.profiles.weight_tracker.reduce((closest, current) => {
      const currentDate = dayjs(current.date_entry)
      const closestDate = dayjs(closest.date_entry)
      return currentDate.diff(endDate) < closestDate.diff(endDate) ? current : closest
    }).weight
  }
  const isCreator = user && competitionData?.[0]?.created_by === user.id
  const calculateProgress = (competition: Competition) => {
    const start = dayjs(competition.date_started)
    const end = dayjs(competition.date_ending)
    const now = dayjs()
    const total = end.diff(start)
    const current = now.diff(start)
    const progress = Math.min(Math.max((current / total) * 100, 0), 100)
    return Math.round(progress)
  }
  const handleLeaveCompetition = async () => {
    if (!user) return
    if (isCreator) {
      alert("Competition creators cannot leave their own competitions")
      return
    }
    try {
      const { error } = await supabase
        .from("competitions_players")
        .delete()
        .match({
          competition_id: params.id,
          player_id: user.id,
        })
      if (error) {
        throw error
      }
      router.push("/competitions")
    } catch (error) {
      console.error("Error leaving competition:", error)
      alert("Failed to leave competition. Please try again.")
    }
  }

  // Now do conditional rendering
  if (!user) {
    router.push('/login')
    return null
  }
  if (error) return (
    <div className="text-center mt-20">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">
        Failed to load competition
      </h2>
      <p className="text-gray-500 text-lg">
        Please try refreshing the page
      </p>
    </div>
  )
  if (isLoading) return (
    <div className="text-center mt-20">
      <span className="text-gray-700">Loading competition...</span>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg shadow-lg p-6">
      {competitionData?.map((competition) => (
        <div key={competition.id} className="pb-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {competition.name}
            </h1>
            <div className="flex gap-4">
              {!isCreator && (
                <LeaveCompetition leaveCompetition={handleLeaveCompetition} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="text-lg font-semibold">
                {dayjs(competition.date_started).format("MMMM D, YYYY")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="text-lg font-semibold">
                {dayjs(competition.date_ending).format("MMMM D, YYYY")}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm text-muted-foreground mb-2">
              Competition Progress
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress(competition)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Start</span>
              <span>{calculateProgress(competition)}% Complete</span>
              <span>End</span>
            </div>
          </div>

          {sortedData.map((player) => {
            if (player.playerId === user.id) {
              return (
                <div
                  key="personal-stats"
                  className="mb-6 p-4 bg-primary/10 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-3">Your Progress</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Current Rank
                      </p>
                      <p className="text-xl font-bold">
                        {getOrdinalSuffix(player.rank)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p
                        className={`text-xl font-bold ${
                          player.percentageChange === "-"
                            ? "text-gray-500"
                            : typeof player.percentageChange === "string" &&
                              !player.percentageChange.includes("-")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {player.percentageChange}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="text-xl font-bold">
                        {(() => {
                          const player = competition.competitions_players.find(
                            (p) => p.player_id === user.id
                          )
                          if (!player?.profiles?.weight_tracker?.length)
                            return "-"
                          const lastWeight =
                            player.profiles.weight_tracker.reduce(
                              (a, b) =>
                                dayjs(a.date_entry).isAfter(dayjs(b.date_entry))
                                  ? a
                                  : b
                            )
                          return dayjs(lastWeight.date_entry).format("MMMM D, YYYY")
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })}

          {competition.has_prizes && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {competition.prizes?.map((prize, index) => {
                const colors = {
                  1: {
                    border: "border-yellow-500/50",
                    bg: "bg-yellow-500/10",
                    text: "text-yellow-500 dark:text-black",
                  },
                  2: {
                    border: "border-gray-400/50",
                    bg: "bg-gray-400/10",
                    text: "text-gray-400 dark:text-black",
                  },
                  3: {
                    border: "border-amber-700/50",
                    bg: "bg-amber-700/10",
                    text: "text-amber-700 dark:text-black",
                  },
                }
                const prizeColors = colors[prize.place as keyof typeof colors]
                return (
                  <Alert
                    key={index}
                    className={`${prizeColors.border} ${prizeColors.bg}`}
                  >
                    <GiTrophyCup className={`h-5 w-5 ${prizeColors.text}`} />
                    <AlertTitle className={prizeColors.text}>
                      {getOrdinalSuffix(prize.place)} Place
                    </AlertTitle>
                    <AlertDescription className="text-black">
                      {prize.type === "money"
                        ? `$${prize.reward}`
                        : prize.reward}
                    </AlertDescription>
                  </Alert>
                )
              })}
            </div>
          )}

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
              {dayjs(competition.created_at).format("MMMM D, YYYY")}
            </span>
          </div>

          {competition.rules && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Rules</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="text-sm text-gray-800">{competition.rules}</pre>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
