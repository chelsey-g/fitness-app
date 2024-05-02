import { createClient } from "@/utils/supabase/client"
import useSWR from "swr"
import { useState } from "react"

const UploadPhoto = () => {
  const supabase = createClient()
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const {
    data: user,
    error,
    isLoading,
  } = useSWR("/user", () =>
    supabase.auth.getUser().then((res) => res.data.user)
  )

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = () => {
    if (!selectedFile) {
      console.log("No file selected")
      return
    }

    setUploading(true)

    const avatarFile = selectedFile
    const fileName = user.user.id
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
      })
      .catch((error) => {
        console.error("Error uploading file:", error.message)
        setUploading(false)
      })
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Photo</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}

export default UploadPhoto
