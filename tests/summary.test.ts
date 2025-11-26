require("dotenv").config({ path: [".env.local", ".env"] })

import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";

// Create a shared Supabase client instance for the mock
// This ensures the same client is used for both test data insertion and queries
let sharedSupabaseClient: any = null;

// Mock the Supabase server client to avoid Next.js cookies() issue
vi.mock("@/utils/supabase/server", () => {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  
  return {
    createClient: async () => {
      // Load env vars at runtime
      require("dotenv").config({ path: [".env.local", ".env"] });
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables");
      }
      
      // Return a new client instance each time (they share the same storage/cookies)
      // But reuse if already created to maintain session
      if (!sharedSupabaseClient) {
        sharedSupabaseClient = createSupabaseClient(supabaseUrl, supabaseKey);
      }
      return sharedSupabaseClient;
    }
  };
});

import { generateWeeklySummary } from "../lib/summary";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local or .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);
// Use service role key for admin operations (bypasses RLS)
const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;

describe("Weekly Summary Generation", () => {
  let testUser;
  let testChallenge;

  beforeAll(async () => {
    // Create a test user using admin client to avoid email confirmation
    if (supabaseServiceRoleKey) {
      // First, try to get existing user via admin
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = usersData?.users?.find(u => u.email === "summary.test@example.com");
      
      if (existingUser) {
        // User already exists, confirm email if not confirmed
        if (!existingUser.email_confirmed_at) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            email_confirm: true,
          });
        }
        testUser = existingUser;
      } else {
        // User doesn't exist, create with admin API
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email: "summary.test@example.com",
          password: "password123",
          email_confirm: true,
        });
        
        if (adminError) {
          console.error("Error creating test user via admin:", adminError);
          throw adminError;
        }
        
        if (adminData?.user) {
          testUser = adminData.user;
        } else {
          throw new Error("Failed to create test user via admin");
        }
      }
    } else {
      // If no admin key, try to sign in (assuming user exists and is confirmed)
      // Or create user normally
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: "summary.test@example.com",
        password: "password123",
      });
      
      if (signInError && signInError.message?.includes("Email not confirmed")) {
        throw new Error("Test requires admin privileges (SUPABASE_SERVICE_ROLE_KEY) to confirm email. Please set the service role key in your .env.local file");
      }
      
      if (signInError) {
        // User doesn't exist, try to create
        const { data, error } = await supabase.auth.signUp({
          email: "summary.test@example.com",
          password: "password123",
        });
        if (error) {
          console.error("Error creating test user:", error);
          throw error;
        }
        testUser = data?.user;
      } else {
        testUser = signInData?.user;
      }
    }
    
    if (!testUser) {
      throw new Error("Failed to create or retrieve test user");
    }

    // Create a test challenge (required for daily_progress)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 75);
    
    const { data: challengeData, error: challengeError } = await supabaseAdmin
      .from("challenges")
      .insert({
        user_id: testUser.id,
        name: "Test Challenge for Summary",
        tier: "Soft",
        start_date: today.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        rules: ["Rule 1", "Rule 2", "Rule 3"],
        is_active: true,
        custom_rules: null,
      })
      .select()
      .single();
    
    if (challengeError) {
      console.error("Error creating test challenge:", challengeError);
      throw challengeError;
    }
    testChallenge = challengeData;

    // Insert some test data for the user
    const progressData = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      progressData.push({
        challenge_id: testChallenge.id,
        user_id: testUser.id,
        date: date.toISOString().split("T")[0],
        is_complete: true,
        completed_rules: [0, 1, 2],
      });
    }
    // Add a day with incomplete progress
    const incompleteDate = new Date(today);
    incompleteDate.setDate(today.getDate() - 5);
    progressData.push({
      challenge_id: testChallenge.id,
      user_id: testUser.id,
      date: incompleteDate.toISOString().split("T")[0],
      is_complete: false,
      completed_rules: [0, 1],
    });

    // Use admin client for inserting test data (bypasses RLS)
    const { error: insertError } = await supabaseAdmin
      .from("daily_progress")
      .insert(progressData);
    if (insertError) {
      console.error("Error inserting test data:", insertError);
      throw insertError;
    }
  });

  afterAll(async () => {
    // Clean up the test user and their data
    // Use admin client for deletion (bypasses RLS)
    if (testUser?.id) {
      if (testChallenge?.id) {
        await supabaseAdmin.from("daily_progress").delete().eq("challenge_id", testChallenge.id);
        await supabaseAdmin.from("challenges").delete().eq("id", testChallenge.id);
      }
      // Clean up any remaining daily_progress entries for the user
      await supabaseAdmin.from("daily_progress").delete().eq("user_id", testUser.id);
    }
    await supabase.auth.signOut();
    // You might need admin rights to delete the user completely
    // For this example, we'll just sign out
  });

  test("should generate a correct weekly summary", async () => {
    // Sign in the test user so the mocked server client has authentication context
    // Get the mocked createClient from the module
    const { createClient: createServerClient } = await import("@/utils/supabase/server");
    const serverSupabase = await createServerClient();
    
    // Sign in with the test user to set the session
    const { error: signInError } = await serverSupabase.auth.signInWithPassword({
      email: "summary.test@example.com",
      password: "password123",
    });
    
    if (signInError && !signInError.message?.includes("Email not confirmed")) {
      console.error("Error signing in for summary generation:", signInError);
    }
    
    const summary = await generateWeeklySummary(testUser.id);
    expect(summary).toContain("Here's your weekly summary:");
    expect(summary).toContain("You've completed 17 habits in the last 7 days.");
    expect(summary).toContain("Your current streak is 5 days.");
  });
});
