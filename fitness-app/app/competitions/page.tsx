import { IoIosAdd } from "react-icons/io"
import Navigation from "@/components/Navigation"
import { createClient } from "@/utils/supabase/client"

export default async function CompetitionsPage() {
  const supabase = createClient()

  let { data: competitions, error } = await supabase
    .from("competitions")
    .select(`name`)

  return (
    <div>
      <Navigation />
      <h1 className="p-4 text-2xl font-semibold text-white">
        Current Competitions
      </h1>
      <div className="p-4">
        <button className="bg-snd-bkg hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <IoIosAdd className="mr-2" />
          Create
        </button>
        <div className="flex flex-wrap -mx-2">
          {competitions?.map((result, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2">
              <div className="bg-white shadow-md p-4 mb-4 rounded-lg mt-5">
                <h2 className="text-2xl font-bold text-gray-800 cursor-pointer">
                  {result.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
