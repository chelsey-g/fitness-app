import React, { useEffect, useState } from "react"
import { Select, Space, ConfigProvider } from "antd"

import { createClient } from "@/utils/supabase/client"

export default function AddPlayers({
  selectPlayers,
}: {
  selectPlayers: (ids: any[]) => void
}) {
  const supabase = createClient()

  const [profiles, setProfiles] = useState<profiles[]>([])
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<any>([])

  type profiles = {
    id: string
    first_name: string
  }

  const options = profiles.map((profile) => ({
    label: `${profile.first_name}`,
    value: profile.id,
  }))
  const handleChange = (selectedIds: any) => {
    setSelectedPlayerIds(selectedIds)
    selectPlayers(selectedIds)
  }

  useEffect(() => {
    async function fetchProfiles() {
      let { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
      if (profiles) {
        setProfiles(profiles)
      }
    }
    fetchProfiles()
  }, [])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#003D33",
          borderRadius: 1,
          colorBgContainer: "#FFFFFF",
        },
      }}
    >
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
    </ConfigProvider>
  )
}
