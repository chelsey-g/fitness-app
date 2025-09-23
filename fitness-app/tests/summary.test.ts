import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { generateWeeklySummary } from "../lib/summary";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

describe("Weekly Summary Generation", () => {
  let testUser;

  beforeAll(async () => {
    // Create a test user
    const { data, error } = await supabase.auth.signUp({
      email: "summary.test@example.com",
      password: "password123",
    });
    if (error) {
      console.error("Error creating test user:", error);
      // If user already exists, sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: "summary.test@example.com",
        password: "password123",
      });
      if (signInError) {
        console.error("Error signing in test user:", signInError);
        throw signInError;
      }
      testUser = signInData.user;
    } else {
      testUser = data.user;
    }


    // Insert some test data for the user
    const today = new Date();
    const progressData = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      progressData.push({
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
      user_id: testUser.id,
      date: incompleteDate.toISOString().split("T")[0],
      is_complete: false,
      completed_rules: [0, 1],
    });

    const { error: insertError } = await supabase
      .from("daily_progress")
      .insert(progressData);
    if (insertError) {
      console.error("Error inserting test data:", insertError);
      throw insertError;
    }
  });

  afterAll(async () => {
    // Clean up the test user and their data
    await supabase.from("daily_progress").delete().eq("user_id", testUser.id);
    await supabase.auth.signOut();
    // You might need admin rights to delete the user completely
    // For this example, we'll just sign out
  });

  test("should generate a correct weekly summary", async () => {
    const summary = await generateWeeklySummary(testUser.id);
    expect(summary).toContain("Here's your weekly summary:");
    expect(summary).toContain("You've completed 17 habits in the last 7 days.");
    expect(summary).toContain("Your current streak is 5 days.");
  });
});
