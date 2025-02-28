"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingBag, Zap } from "lucide-react"

interface SpellMarketProps {
  walletAddress: string
}

interface Spell {
  id: number
  name: string
  power: number
  price: number
  creator: string
}

export function SpellMarket({ walletAddress }: SpellMarketProps) {
  const { toast } = useToast()
  const [spells, setSpells] = useState<Spell[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock API call to fetch spells for sale
    const fetchSpells = async () => {
      setLoading(true)
      try {
        // Replace with actual API call
        setTimeout(() => {
          setSpells([
            { id: 1, name: "Fireball", power: 50, price: 100, creator: "SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9" },
            { id: 2, name: "Ice Blast", power: 40, price: 80, creator: "SP1QK1HBPFKQ1HBPFKQ1HBPFKQ1HBPFKQ1HBPFKQ" },
            {
              id: 3,
              name: "Lightning Strike",
              power: 60,
              price: 120,
              creator: "SP3ABCDEF9FTAJYNFZH93XENAJ8FVY99RRM50",
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch spells:", error)
        setLoading(false)
      }
    }

    fetchSpells()
  }, [])

  const buySpell = async (spellId: number) => {
    try {
      // Mock contract call - replace with actual contract interaction
      setTimeout(() => {
        toast({
          title: "Spell Purchased",
          description: `You have successfully purchased the spell!`,
        })
        // Update local state to reflect the purchase
        setSpells(spells.filter((spell) => spell.id !== spellId))
      }, 1500)
    } catch (error) {
      console.error("Failed to buy spell:", error)
      toast({
        title: "Purchase Failed",
        description: "There was an error buying the spell. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ShoppingBag className="h-6 w-6 text-purple-300" />
        Spell Market
      </h2>

      {loading ? (
        <div className="text-center py-12">Loading spells...</div>
      ) : spells.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {spells.map((spell) => (
            <Card key={spell.id} className="bg-purple-800 border-purple-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{spell.name}</span>
                  <Zap className="h-5 w-5 text-yellow-400" />
                </CardTitle>
                <CardDescription className="text-purple-300">Power: {spell.power}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-purple-200">Price: {spell.price} STX</p>
                <p className="text-sm text-purple-400">
                  Creator: {spell.creator.substring(0, 6)}...{spell.creator.substring(spell.creator.length - 4)}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => buySpell(spell.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Buy Spell
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-purple-800 rounded-lg border border-purple-600">
          <p className="text-xl">No spells available for purchase at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default SpellMarket