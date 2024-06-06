require("dotenv").config()
import { describe, expect, test, beforeAll, afterAll } from "vitest"

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL

const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_KEY

var supabase = createClient(supabaseUrl, supabaseKey)
var supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

describe("Permissions Tests", () => {
  let authUser

  beforeAll(async () => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: "testuser@example.com",
      password: "password123",
      email_confirm: true,
    })
    if (error) throw error
    authUser = data.user
  })

  afterAll(async () => {
    await supabase.auth.admin.deleteUser(authUser.id)
  })

  test("anonymous cannot load competitions", async () => {
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

  test("anonymous cannot load weight_tracker", async () => {
    const { data, error } = await supabase.from("weight_tracker").select("*")
    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  // test("members of a competition should be able to load their competitions", async () => {
  //   await supabase.auth.signIn({
  //     email: "testuser@example.com",
  //     password: "password123",
  //   })
  //   const { data, error } = await supabase.from("competitions").select("*")
  //   expect(error).toBeNull()
  //   expect(data).toEqual([])
  // })

  // test("Authenticated user can fetch private data", async () => {
  //   const { session, error: loginError } = await supabase.auth.signIn({
  //     email: "testuser@example.com",
  //     password: "password123",
  //   })
  //   if (loginError) throw loginError

  //   const { data, error } = await supabase
  //     .from("private_table")
  //     .select("*")
  //     .eq("user_id", authUser.id)

  //   expect(error).toBeNull()
  //   expect(data).toBeDefined()
  // })

  // test("Anonymous user cannot fetch private data", async () => {
  //   // Sign out the authenticated user to become anonymous
  //   await supabase.auth.signOut()

  //   const { data, error } = await supabase.from("private_table").select("*")

  //   expect(error).toBeDefined()
  //   expect(data).toBeNull()
  // })

  // test("Authenticated user can insert data", async () => {
  //   const { session, error: loginError } = await supabase.auth.signIn({
  //     email: "testuser@example.com",
  //     password: "password123",
  //   })
  //   if (loginError) throw loginError

  //   const { data, error } = await supabase
  //     .from("private_table")
  //     .insert([{ user_id: authUser.id, content: "Test content" }])

  //   expect(error).toBeNull()
  //   expect(data).toBeDefined()
  // })

  // test("Anonymous user cannot insert data", async () => {
  //   // Sign out the authenticated user to become anonymous
  //   await supabase.auth.signOut()

  //   const { data, error } = await supabase
  //     .from("private_table")
  //     .insert([{ content: "Test content" }])

  //   expect(error).toBeDefined()
  //   expect(data).toBeNull()
  // })
})
