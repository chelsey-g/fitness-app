"use client"

import { useEffect, useState } from "react"

import AddPlayers from "@/components/AddPlayers"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import BackButton from "@/components/BackButton"

export default function CreateCompetitionPage() {
  const supabase = createClient()
  const router = useRouter()

  const [competitionData, setCompetitionData] = useState({
    name: "",
    date_started: "",
    date_ending: "",
    rules: "",
  })
  const [addPlayers, setAddPlayers] = useState(false)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])
  const [user, setUser] = useState<any | null>(null)
  const [invitedEmails, setInvitedEmails] = useState<string[]>([])

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error getting user:", error)
      } else {
        setUser(data.user)
      }
    }

    getUser()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log("No session found, redirecting to login")
        router.push('/login')
        return
      }
    }
    checkAuth()
  }, [])

  const handleSelectPlayers = (selectedPlayers: any) => {
    setSelectedPlayerIds(selectedPlayers)
  }

  const handleChange = (e: any) => {
    setCompetitionData({ ...competitionData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      console.error("User is not authenticated")
      router.push('/login')
      return
    }

    // Validate required fields
    if (!competitionData.name) {
      alert("Please enter a competition name")
      return
    }

    if (!competitionData.date_started || !competitionData.date_ending) {
      alert("Please select both start and end dates")
      return
    }

    // First create the competition
    const { data: competitionInfo, error: insertError } = await supabase
      .from("competitions")
      .insert([
        {
          name: competitionData.name,
          date_started: competitionData.date_started,
          date_ending: competitionData.date_ending,
          rules: competitionData.rules,
          created_by: session.user.id,
        },
      ])
      .select()

    if (insertError) {
      console.error("Error inserting competition:", insertError)
      return
    }

    const competitionId = competitionInfo?.[0]?.id

    if (!competitionId) {
      console.error("Competition ID not found after insertion")
      return
    }

    // Add selected players to the competition
    if (selectedPlayerIds.length > 0) {
      console.log("Adding selected players:", selectedPlayerIds)
      const { error: playerInsertError } = await supabase
        .from("competitions_players")
        .insert(
          selectedPlayerIds.map((playerId) => ({
            player_id: playerId,
            competition_id: competitionId
          }))
        )

      if (playerInsertError) {
        console.error("Error inserting competition players:", playerInsertError)
      }
    }

    // Process email invitations
    if (invitedEmails.length > 0) {
      console.log("Processing invitations for emails:", invitedEmails)

      for (const email of invitedEmails) {
        try {
          // Create invitation record
          const { error: inviteError } = await supabase
            .from('competition_invitations')
            .insert({
              competition_id: competitionId,
              email: email,
              invited_by: session.user.id,
              status: 'pending'
            })
            .select()
            .single()

          if (inviteError) {
            console.error(`Failed to create invitation record for ${email}:`, inviteError)
            continue
          }

          // Send invitation email
          const response = await fetch('/api/send-invitation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              competitionName: competitionData.name,
              competitionId: competitionId
            })
          })

          if (!response.ok) {
            throw new Error('Failed to send invitation')
          }

          console.log(`Invitation sent to ${email}`)
        } catch (error) {
          console.error('Error processing invitation:', error)
        }
      }
    }

    router.push("/competitions")
  }

  const handleAddPlayers = (e: any) => {
    setAddPlayers(e.target.value === "yes")
  }

  const handleAddEmail = (inputElement: HTMLInputElement) => {
    const email = inputElement.value.trim()
    if (email && !invitedEmails.includes(email)) {
      setInvitedEmails([...invitedEmails, email])
      inputElement.value = ''
      console.log('Added email:', email, 'Current emails:', [...invitedEmails, email])
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="max-w-5xl mx-auto mt-6 bg-white dark:text-black rounded-lg relative">
          <BackButton />
          <div className="border-b-2 border-snd-bkg pb-4 m-6 pt-6">
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
              Create Competition
            </h2>
            <p className="text-lg text-gray-700">
              Set up a new competition and invite players to join the fun.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="name">
                Name of Competition
              </label>
              <input
                type="text"
                id="name"
                placeholder="Competition Name"
                name="name"
                value={competitionData.name}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Select Players</label>
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    type="radio"
                    name="selectPlayers"
                    value="yes"
                    onChange={handleAddPlayers}
                    checked={addPlayers === true}
                    className="mr-2 text-snd-bkg focus:border-snd-bkg focus:ring focus:ring-snd-bkg"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="selectPlayers"
                    value="no"
                    onChange={handleAddPlayers}
                    checked={addPlayers === false}
                    className="mr-2 text-snd-bkg focus:border-snd-bkg focus:ring focus:ring-snd-bkg"
                  />
                  No
                </label>
              </div>
            </div>

            {addPlayers && (
              <div className="mb-4" data-testid="add-players">
                <AddPlayers selectPlayers={handleSelectPlayers} />
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="date_started">
                Start Date
              </label>
              <input
                type="date"
                id="date_started"
                name="date_started"
                value={competitionData.date_started}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="date_ending">
                End Date
              </label>
              <input
                type="date"
                id="date_ending"
                name="date_ending"
                value={competitionData.date_ending}
                required
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1" htmlFor="rules">
                Rules
              </label>
              <textarea
                id="rules"
                name="rules"
                value={competitionData.rules}
                onChange={handleChange}
                rows={4}
                className="p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Invite Players by Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:border-logo-green focus:ring focus:ring-logo-green"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddEmail(e.currentTarget)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => handleAddEmail(e.currentTarget.previousElementSibling as HTMLInputElement)}
                  className="px-4 py-2 bg-logo-green text-white rounded-md hover:opacity-90"
                >
                  Add
                </button>
              </div>
              {invitedEmails.length > 0 && (
                <div className="mt-2 space-y-2">
                  {invitedEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setInvitedEmails(invitedEmails.filter(e => e !== email))
                          console.log('Removed email:', email, 'Current emails:', invitedEmails.filter(e => e !== email))
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-logo-green dark:bg-snd-bkg text-black dark:text-white font-medium hover:opacity-90"
              >
                Create Competition
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
