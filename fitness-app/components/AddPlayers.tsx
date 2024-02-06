import React, { useEffect, useState } from "react"
import { Select, Space } from "antd"

import { createClient } from "@/utils/supabase/client"

export default function AddPlayers({ selectPlayers }) {
  const supabase = createClient()

  const [profiles, setProfiles] = useState([])
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([])

  const options = profiles.map((profile) => ({
    label: `${profile.first_name}`,
    value: profile.id,
  }))
  const handleChange = (selectedIds) => {
    setSelectedPlayerIds(selectedIds)
    selectPlayers(selectedIds)
  }

  useEffect(() => {
    async function fetchProfiles() {
      let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
      setProfiles(profiles)
    }
    fetchProfiles()
  }, [])

  return (
    <Space
      style={{
        width: "100%",
      }}
      direction="vertical"
    >
      <Select
        mode="multiple"
        allowClear
        style={{
          width: "100%",
        }}
        placeholder="Select Players"
        onChange={handleChange}
        options={options}
        value={selectedPlayerIds}
      />
    </Space>
  )
}
