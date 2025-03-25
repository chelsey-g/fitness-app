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
import { useRouter } from "next/navigation"
import LeaveCompetition from "@/components/LeaveCompetition"
import { useState, useEffect } from "react"

type Player = {
  rank: number
  player: string
  percentageChange: string | number
  playerId: string
}

export default function CompetitionPage(props: any) {
  const supabase = createClient()
  const router = useRouter()

  const {
    data: competitionData,
    error,
    isLoading,
  } = useSWR("/competitions/name", async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("competitions")
      .select(
        `
        *,
        competitions_players!inner(
          *,
          profiles(
            id,
            first_name,
            last_name,
            weight_tracker(weight, date_entry)
          )
        )
      `
      )
      .eq("id", props.params.id)
      .single()

    if (error) throw error
    return data ? [data] : []
  })

  const [isCreator, setIsCreator] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setCurrentUserId(user.id)
        if (competitionData?.[0]) {
          setIsCreator(user.id === competitionData[0].created_by)
        }
      }
    }
    checkUser()
  }, [competitionData])

  function getCreatedBy(competition: any) {
    const creator = competition.competitions_players.find(
      (player: any) => player.player_id === competition.created_by
    )

    return creator?.profiles
      ? `${creator.profiles.first_name} ${creator.profiles.last_name}`
      : "Unknown"
  }

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

  const difference: Player[] = []
  if (competitionData) {
    competitionData.forEach((competition) => {
      competition.competitions_players.forEach((player: any) => {
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
        (p: any) => p.place === rank
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

  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleLeaveCompetition = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    if (competitionData?.[0]?.created_by === user.id) {
      alert("Competition creators cannot leave their own competitions")
      return
    }

    const { error } = await supabase
      .from("competitions_players")
      .delete()
      .match({
        competition_id: props.params.id,
        player_id: user.id,
      })

    if (error) {
      console.error("Error leaving competition:", error)
      alert("Failed to leave competition")
    } else {
      router.push("/competitions")
    }
  }

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
            {!isCreator && (
              <LeaveCompetition leaveCompetition={handleLeaveCompetition} />
            )}
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="text-lg font-semibold">
                {handleDate(competition.date_started)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="text-lg font-semibold">
                {handleDate(competition.date_ending)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm text-muted-foreground mb-2">
              Competition Progress
            </h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              {(() => {
                const start = new Date(competition.date_started).getTime()
                const end = new Date(competition.date_ending).getTime()
                const now = new Date().getTime()
                const progress = Math.min(
                  Math.max(((now - start) / (end - start)) * 100, 0),
                  100
                )
                return (
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                )
              })()}
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Start</span>
              <span>
                {Math.round(
                  ((new Date().getTime() -
                    new Date(competition.date_started).getTime()) /
                    (new Date(competition.date_ending).getTime() -
                      new Date(competition.date_started).getTime())) *
                    100
                )}
                % Complete
              </span>
              <span>End</span>
            </div>
          </div>

          {sortedData.map((player) => {
            if (player.playerId === currentUserId) {
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
                            (p: any) => p.player_id === supabase.auth.getUser()
                          )
                          if (!player?.profiles?.weight_tracker?.length)
                            return "-"
                          const lastWeight =
                            player.profiles.weight_tracker.reduce(
                              (a: any, b: any) =>
                                new Date(a.date_entry) > new Date(b.date_entry)
                                  ? a
                                  : b
                            )
                          return handleDate(lastWeight.date_entry)
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
              {competition.prizes?.map((prize: any, index: number) => {
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
              {handleDate(competition.created_at)}
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
