require("dotenv").config({ path: [".env.local", ".env"] })

import { afterAll, beforeAll, describe, expect, test } from "vitest"

const dayjs = require("dayjs")

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

type users = {
  userAnon: any
  userA: any
  userB: any
  userC: any
}

type competitions = {
  public: any
  privateA: any
  privateB: any
  privateC: any
}

type competitionPlayers = {
  PublicUserA: any
  privateAUserA: any
  privateBUserB: any
  privateAUserB: any
  privateAUserC: any
  privateCUserC: any
}

type workoutLists = {
  workoutA: any
  workoutB: any
  workoutC: any
}

async function deleteUserIfExists(email: any) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    email: email,
  })

  if (data && data.length > 0) {
    await supabaseAdmin.auth.admin.deleteUser(data[0].id)
  }
}

async function createUser(user: any) {
  try {
    await deleteUserIfExists(user.email)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: user.email,
      password: user.password,
    })

    if (error) {
      console.error("Error creating user:", error.message)
      console.error("Error details:", error)
      throw error
    }
    return { ...data.user, password: user.password }
  } catch (error: any) {
    console.error("Error creating user:", error.message)
    throw error
  }
}

async function createCompetition(name: string, user: any) {
  const { data, error } = await supabaseAdmin
    .from("competitions")
    .insert({
      name,
      created_by: user.id,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

async function createCompetitionPlayer(competition: any, user: any) {
  const { data: competitionData, error: fetchError } = await supabaseAdmin
    .from("competitions")
    .select("created_by")
    .eq("id", competition.id)
    .single()

  if (fetchError) {
    throw new Error("Error fetching competition data")
  }

  // if (competitionData.created_by !== user.id) {
  //   throw new Error("Permission denied")
  // }

  const { data, error } = await supabaseAdmin
    .from("competitions_players")
    .insert([
      {
        competition_id: competition.id,
        player_id: user.id,
        created_by: user.id,
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

async function createWorkoutList(list: any, user: any) {
  const { data, error } = await supabaseAdmin
    .from("lists")
    .insert([
      {
        name: list,
        created_by: user.id,
      },
    ])
    .select()
    .single()
  if (error) throw error
  return data
}

async function createGoal(
  created_at: any,
  goal_weight: number,
  user: any,
  date: any
) {
  const { data, error } = await supabaseAdmin
    .from("profile_goals")
    .insert([
      {
        created_at: created_at,
        goal_weight: goal_weight,
        profile_id: user.id,
        goal_date: date,
      },
    ])
    .select()
    .single()
  if (error) throw error
  return data
}
// async function createWeightEntries(playerIds, weight) {
//   const { data, error } = await supabase
//     .from("weight_tracker")
//     .insert([{ created_by: playerIds, weight: weight, date_entry: new Date() }])
//     .select()
//   if (error) throw error
//   return data
// }

describe("Permissions Tests", () => {
  let users: { [key: string]: any } = {}
  let competitions: { [key: string]: any } = {}
  let competitionPlayers: { [key: string]: any } = {}
  // let weightEntries = {}
  let workoutLists: { [key: string]: any } = {}
  let goals: { [key: string]: any } = {}

  beforeAll(async () => {
    users.userAnon = await createUser({
      email: "anon@example.com",
      password: "password123",
    })

    users.userA = await createUser({
      email: "userA@example.com",
      password: "password123",
    })

    users.userB = await createUser({
      email: "userB@example.com",
      password: "password123",
    })

    users.userC = await createUser({
      email: "userC@example.com",
      password: "password123",
    })

    // console.log("user check", users)

    competitions.public = await createCompetition(
      "Public Competition",
      users.userAnon
    )
    competitions.privateA = await createCompetition(
      "Private Competition (User A)",
      users.userA
    )
    competitions.privateB = await createCompetition(
      "Private Competition (User B)",
      users.userB
    )
    competitions.privateC = await createCompetition(
      "Private Competition (User C)",
      users.userC
    )

    workoutLists.workoutA = await createWorkoutList("List A", users.userA)
    workoutLists.workoutB = await createWorkoutList("List B", users.userB)
    workoutLists.workoutC = await createWorkoutList("List C", users.userC)

    competitionPlayers.PublicUserA = await createCompetitionPlayer(
      competitions.public,
      users.userA
    )
    competitionPlayers.privateAUserA = await createCompetitionPlayer(
      competitions.privateA,
      users.userA
    )
    competitionPlayers.privateBUserB = await createCompetitionPlayer(
      competitions.privateB,
      users.userB
    )
    competitionPlayers.privateAUserB = await createCompetitionPlayer(
      competitions.privateA,
      users.userB
    )
    competitionPlayers.privateAUserC = await createCompetitionPlayer(
      competitions.privateA,
      users.userC
    )
    competitionPlayers.privateCUserC = await createCompetitionPlayer(
      competitions.privateC,
      users.userC
    )

    goals.goalA = await createGoal(
      dayjs().format(),
      60,
      users.userA,
      dayjs().add(1, "month").format()
    )

    goals.goalB = await createGoal(
      dayjs().format(),
      70,
      users.userB,
      dayjs().add(1, "month").format()
    )

    goals.goalC = await createGoal(
      dayjs().format(),
      80,
      users.userC,
      dayjs().add(1, "month").format()
    )

    // console.log("Users:", users)
    // console.log("Competitions:", competitions)
    // console.log("Competition Players:", competitionPlayers)
    // weightEntries.weightA = await createWeightEntries(users.userA.id, 60)

    // weightEntries.weightB = await createWeightEntries(users.userB.id, 70)
    // weightEntries.weightC = await createWeightEntries(users.userC.id, 80)
    // console.log("Weight Entries:", weightEntries)
  })

  afterAll(async () => {
    for (const compPlayer of Object.values(competitionPlayers)) {
      await supabaseAdmin
        .from("competitions_players")
        .delete()
        .match({ id: compPlayer.id })
    }
    for (const list of Object.values(workoutLists)) {
      try {
        // console.log("Deleting list:", list)
        await supabaseAdmin.from("lists").delete().match({ id: list.id })
      } catch (error: any) {
        console.error("Error deleting workout list:", error.message)
      }
    }
    for (const comp of Object.values(competitions)) {
      await supabaseAdmin.from("competitions").delete().match({ id: comp.id })
    }
    for (const user of Object.values(users)) {
      await supabaseAdmin.auth.admin.deleteUser(user.id)
    }
  })

  test("anonymous cannot load competitions", async () => {
    const { data: session, error: signInError } =
      await supabaseAdmin.auth.signInWithPassword({
        email: users.userAnon.email,
        // password: playerA.password,
      })
    const { data, error } = await supabase.from("competitions").select("*")
    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  test("anonymous cannot load profiles", async () => {
    const { data, error } = await supabase.from("profiles").select("*")
    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  test("anonymous cannot load competitions_players", async () => {
    const { data, error } = await supabase
      .from("competitions_players")
      .select("*")
    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  test("anonymous cannot load lists", async () => {
    const { data, error } = await supabase.from("lists").select("*")
    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  test("player A can only see competitions they are involved in", async () => {
    const { data: session, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: users.userA.email,
        password: users.userA.password,
      })
    if (signInError) throw signInError

    const { data, error } = await supabase.from("competitions").select("*")
    expect(error).toBeNull()
    // console.log("Fetched Competitions for userA:", data)
    expect(data.map((comp: any) => comp.name)).toEqual(
      expect.arrayContaining([
        "Public Competition",
        "Private Competition (User A)",
      ])
    )
    expect(data.map((comp: any) => comp.name)).not.toEqual(
      expect.arrayContaining(["Private Competition (User B)"])
    )

    await supabase.auth.signOut()
  })

  test("player B can only see competitions they are involved in", async () => {
    const { data: session, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: users.userB.email,
        password: users.userB.password,
      })
    if (signInError) throw signInError

    const { data, error } = await supabase.from("competitions").select("*")
    // console.log("Fetched Competitions for userB:", data)
    expect(error).toBeNull()
    expect(data.map((comp: any) => comp.name)).toEqual(
      expect.arrayContaining([
        "Private Competition (User A)",
        "Private Competition (User B)",
      ])
    )
    expect(data.map((comp: any) => comp.name)).not.toEqual(
      expect.arrayContaining(["Private Competition (User C)"])
    )

    await supabase.auth.signOut()
  })

  test("player C can only see competitions they are involved in", async () => {
    const { data: session, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: users.userC.email,
        password: users.userC.password,
      })
    if (signInError) throw signInError

    const { data, error } = await supabase.from("competitions").select("*")
    // console.log("Fetched Competitions for userC:", data)
    expect(error).toBeNull()
    expect(data.map((comp: any) => comp.name)).toEqual(
      expect.arrayContaining([
        "Private Competition (User A)",
        "Private Competition (User C)",
      ])
    )
    expect(data.map((comp: any) => comp.name)).not.toEqual(
      expect.arrayContaining(["Private Competition (User B)"])
    )

    await supabase.auth.signOut()
  })

  test("user can only access their workout lists"),
    async () => {
      const { data, error: signIn } = await supabase.auth.signInWithPassword({
        email: users.userA.email,
        password: users.userA.password,
      })
      if (signIn) throw signIn
      expect(signIn).toBeNull()
      expect(data.map((list: any) => list.name)).toEqual(
        expect.arrayContaining(["List A"])
      )
      expect(data.map((list: any) => list.name)).not.toEqual(
        expect.arrayContaining(["List B", "List C"])
      )
      await supabase.auth.signOut()
    }

  test("user can only access their goals"),
    async () => {
      const { data: session, error: signIn } =
        await supabase.auth.signInWithPassword({
          email: users.userA.email,
          password: users.userA.password,
        })
      if (signIn) throw signIn
      expect(signIn).toBeNull()
      expect(session.map((goal: any) => goal.goal_weight)).toEqual(
        expect.arrayContaining([60])
      )
      expect(session.map((goal: any) => goal.goal_weight)).not.toEqual(
        expect.arrayContaining([70, 80])
      )

      await supabase.auth.signOut()
    }

  test("a user adding a competition player when they did not create it", async () => {
    const { data: session, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: users.userA.email,
        password: users.userA.password,
      })

    if (signInError) throw signInError

    expect(session).not.toBeNull()

    await expect(
      createCompetitionPlayer(competitions.privateB, users.userA)
    ).rejects.toThrowError()

    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError

    expect(signOutError).toBeNull()
  })
})
