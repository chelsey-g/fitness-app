"use client"
import React from "react"
import Navigation from "@/components/Navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ListPage({}) {
  const supabase = createClient()

  const [listData, setListData] = useState([])

  return (
    <div className="container mx-auto p-4">
      <Navigation />
      <h2 className="text-2xl font-bold text-center mb-6">Workouts</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{listData[0]?.name}</div>
            <p className="text-gray-700 text-base">
              Description of the workout...
            </p>
          </div>
          <div className="px-6 pt-4 pb-2"></div>
        </div>
      </div>
    </div>
  )
}
