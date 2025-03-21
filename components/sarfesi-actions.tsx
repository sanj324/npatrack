"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function SARFESIActions() {
  const [caseNumber, setCaseNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/sarfesi/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseNumber }),
      })
      if (!res.ok) throw new Error("Failed to initiate SARFESI action")
      const data = await res.json()
      toast({
        title: "Success",
        description: data.message,
      })
      setCaseNumber("")
    } catch (error) {
      console.error("Error initiating SARFESI action:", error)
      toast({
        title: "Error",
        description: "Failed to initiate SARFESI action",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="caseNumber">Case Number</Label>
        <Input
          id="caseNumber"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          placeholder="Enter case number"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Initiating..." : "Initiate SARFESI Action"}
      </Button>
    </form>
  )
}

