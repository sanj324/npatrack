"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, FileType, AlertCircle } from "lucide-react"
import { importNPAData } from "../utils/dataImport"

export default function Import() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase()
      if (["csv"].includes(fileType || "")) {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Please upload a CSV file.")
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (file) {
      try {
        const data = await importNPAData(file)
        // Save the imported data to our API
        const response = await fetch("/api/npa-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to save data")
        }

        router.push("/dashboard")
      } catch (error) {
        setError("Error importing data. Please check your file and try again.")
      }
    } else {
      setError("Please select a file to upload.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">Import NPA Data</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-blue-400" />
                <p className="mb-2 text-sm text-blue-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-blue-500">CSV file with NPA data (MAX. 10MB)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
            </label>
          </div>
          {file && (
            <div className="flex items-center space-x-2 text-blue-600">
              <FileType className="w-5 h-5" />
              <span>{file.name}</span>
            </div>
          )}
          {error && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={!file}
          >
            Import NPA Data
          </button>
        </form>
      </div>
    </div>
  )
}

