import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export default function InviteFriend() {
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState("")

  const supabase = createClient()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setMessage("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setMessage("You must be logged in to invite friends")
        return
      }

      const signupUrl = `${
        window.location.origin
      }/signup?email=${encodeURIComponent(email)}`
      await navigator.clipboard.writeText(signupUrl)
      setMessage("Invite link copied to clipboard!")
      setEmail("")
    } catch (error) {
      setMessage("Failed to create invite link")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rounded-lg shadow-sm border p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Invite a friend & get rewards.
        </h2>
        <p className="text-gray-600">
          Get additional rewards on your free plan when your friends sign up
          with your invite link.
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
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
