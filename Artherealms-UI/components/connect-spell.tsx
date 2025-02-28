"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { WandIcon as MagicWand } from "lucide-react"

interface CreateSpellProps {
  walletAddress: string
}

export function CreateSpell({ walletAddress }: CreateSpellProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [power, setPower] = useState("")
  const [price, setPrice] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const createSpell = async () => {
    if (!name || !power || !price) return

    setIsCreating(true)

    try {
      // Mock contract call - replace with actual contract interaction
      setTimeout(() => {
        setIsCreating(false)
        toast({
          title: "Spell Created",
          description: `Your spell "${name}" has been created successfully!`,
        })
        setName("")
        setPower("")
        setPrice("")
      }, 1500)
    } catch (error) {
      console.error("Failed to create spell:", error)
      setIsCreating(false)
      toast({
        title: "Spell Creation Failed",
        description: "There was an error creating your spell. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-purple-800 border-purple-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MagicWand className="h-5 w-5 text-purple-300" />
          Create New Spell
        </CardTitle>
        <CardDescription className="text-purple-300">
          Craft a new magical spell to add to your collection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="spell-name" className="text-sm font-medium text-purple-200">
              Spell Name
            </label>
            <Input
              id="spell-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter spell name"
              className="bg-purple-900 border-purple-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="spell-power" className="text-sm font-medium text-purple-200">
              Spell Power
            </label>
            <Input
              id="spell-power"
              type="number"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="Enter spell power"
              className="bg-purple-900 border-purple-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="spell-price" className="text-sm font-medium text-purple-200">
              Initial Price
            </label>
            <Input
              id="spell-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter initial price"
              className="bg-purple-900 border-purple-600 text-white"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={createSpell}
          disabled={isCreating || !name || !power || !price}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isCreating ? "Creating..." : "Create Spell"}
        </Button>
      </CardFooter>
    </Card>
  )
}

