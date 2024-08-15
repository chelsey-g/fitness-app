import { GoPlus } from "react-icons/go"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { useState } from "react"

const UploadPhoto = () => {
  const supabase = createClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const {
    data: user,
    error,
    isLoading,
  } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (!selectedFile) {
      console.log("No file selected")
      return
    }

    setUploading(true)

    const avatarFile = selectedFile
    const fileName = user?.id || "unknown-file-name"
    supabase.storage
      .from("habit-kick/profile-pictures")
      .upload(fileName, avatarFile)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error uploading file:", error.message)
        } else {
          console.log("File uploaded successfully:", fileName)
        }
        setUploading(false)
        router.refresh()
      })
      .catch((error) => {
        console.error("Error uploading file:", error.message)
        setUploading(false)
      })
  }

  return (
    <div className="bg-white rounded-md">
      <h2 className="text-gray-700 font-semibold mb-4">Upload Profile Photo</h2>
      <label htmlFor="file-upload" className="relative cursor-pointer">
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center justify-center bg-snd-bkg text-white px-4 py-2 rounded-md">
          <GoPlus className="mr-1" />
          <span>Choose Photo</span>
        </div>
      </label>
      <span className="block text-sm text-gray-500 mt-2 text-center">
        {selectedFile ? selectedFile.name : "No file chosen"}
      </span>
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400 text-center justify-center flex"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}

export default UploadPhoto
