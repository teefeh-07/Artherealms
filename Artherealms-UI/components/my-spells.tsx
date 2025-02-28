"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, DollarSign } from "lucide-react"

interface MySpellsProps {
  walletAddress: string
}

interface Spell {
  id: number
  name: string
  power: number
  price: number
  isForSale: boolean
}

export function MySpells({ walletAddress }: MySpellsProps) {
  const { toast } = useToast()
  const [spells, setSpells] = useState<Spell[]>([])
  const [loading, setLoading] = useState(true)
  const [listingPrice, setListingPrice] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    // Mock API call to fetch user's spells
    const fetchMySpells = async () => {
      setLoading(true)
      try {
        // Replace with actual API call
        setTimeout(() => {
          setSpells([
            { id: 1, name: "Arcane Missile", power: 30, price: 0, isForSale: false },
            { id: 2, name: "Healing Light", power: 25, price: 0, isForSale: false },
            { id: 3, name: "Shadow Bolt", power: 45, price: 0, isForSale: false },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch spells:", error)
        setLoading(false)
      }
    }

    fetchMySpells()
  }, [])

  const castSpell = async (spellId: number) => {
    try {
      // Mock contract call - replace with actual contract interaction
      setTimeout(() => {
        toast({
          title: "Spell Cast",
          description: `You have successfully cast the spell!`,
        })
      }, 1500)
    } catch (error) {
      console.error("Failed to cast spell:", error)
      toast({
        title: "Spell Casting Failed",
        description: "There was an error casting the spell. Please try again.",
        variant: "destructive",
      })
    }
  }

  const listSpellForSale = async (spellId: number) => {
    const price = listingPrice[spellId]
    if (!price) return

    try {
      // Mock contract call - replace with actual contract interaction
      setTimeout(() => {
        setSpells(
          spells.map((spell) =>
            spell.id === spellId ? { ...spell, price: Number.parseInt(price), isForSale: true } : spell,
          ),
        )
        toast({
          title: "Spell Listed",
          description: `Your spell has been listed for sale at ${price} STX.`,
        })
        setListingPrice({ ...listingPrice, [spellId]: "" })
      }, 1500)
    } catch (error) {
      console.error("Failed to list spell for sale:", error)
      toast({
        title: "Listing Failed",
        description: "There was an error listing your spell. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-purple-300" />
        My Spells
      </h2>

      {loading ? (
        <div className="text-center py-12">Loading your spells...</div>
      ) : spells.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spells.map((spell) => (
            <Card key={spell.id} className="bg-purple-800 border-purple-600">
              <CardHeader>
                <CardTitle>{spell.name}</CardTitle>
                <CardDescription className="text-purple-300">Power: {spell.power}</CardDescription>
              </CardHeader>
              <CardContent>
                {spell.isForSale ? (
                  <p className="text-lg font-semibold text-purple-200">Listed for: {spell.price} STX</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Price in STX"
                      value={listingPrice[spell.id] || ""}
                      onChange={(e) => setListingPrice({ ...listingPrice, [spell.id]: e.target.value })}
                      className="bg-purple-900 border-purple-600 text-white"
                    />
                    <Button
                      onClick={() => listSpellForSale(spell.id)}
                      disabled={!listingPrice[spell.id]}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      List
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => castSpell(spell.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={spell.isForSale}
                >
                  Cast Spell
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-purple-800 rounded-lg border border-purple-600">
          <p className="text-xl">You don't have any spells yet. Create or buy some to get started!</p>
        </div>
      )}
    </div>
  )
}

