import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { profileService } from "@/app/services/ProfileService"
import { AuthService } from "@/app/services/AuthService"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient();
const authService = new AuthService(supabase);

export default function InviteFriend() {
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")


  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setMessage("")

    try {
      const user = await authService.getUser()

      if (!user) {
        setMessage("You must be logged in to invite friends")
        return
      }

   
      const profile = await profileService.getFirstName(user.id)
      const signupUrl = `${
        window.location.origin
      }/signup?email=${encodeURIComponent(email)}`

      const response = await fetch("/api/send-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          inviteUrl: signupUrl,
          inviterName: profile?.first_name || "a friend",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send invitation")
      }

      setMessage("Invitation sent successfully!")
      setEmail("")
    } catch (error) {
      console.error("Error sending invitation:", error)
      setMessage("Failed to send invitation. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rounded-lg shadow-sm border p-8 bg-white dark:bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-logo-green dark:text-logo-green">
          Invite a friend & start competing today
        </h2>
        <p className="text-black dark:text-black">
          Enter your friend's email address and we'll send them a link to sign
          up.
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            type="email"
            placeholder="Enter your friend's email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button
            onClick={handleInvite}
            className="bg-logo-green text-white hover:bg-logo-green/90"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Invite"}
          </Button>
        </div>

        {message && (
          <p
            className={`text-sm text-center ${
              message.includes("Failed") ? "text-red-500" : "text-logo-green"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
