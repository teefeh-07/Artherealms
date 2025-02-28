"use client"

import { useState } from "react"
import { ConnectWallet } from "@/components/connect-wallet"
import { CreateSpell } from "@/components/create-spell"
import { SpellMarket } from "@/components/spell-market"
import { MySpells } from "@/components/my-spells"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WandIcon as MagicWand, ShoppingBag, Sparkles } from "lucide-react"

export function SpellDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2 text-purple-300">SagaSpell</h1>
        <p className="text-center text-purple-200 mb-6">Create, trade, and cast magical spells</p>

        <ConnectWallet walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
      </header>

      {walletAddress ? (
        <Tabs defaultValue="create" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <MagicWand className="h-4 w-4" />
              <span>Create Spell</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Spell Market</span>
            </TabsTrigger>
            <TabsTrigger value="myspells" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>My Spells</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <CreateSpell walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="market">
            <SpellMarket walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="myspells">
            <MySpells walletAddress={walletAddress} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12 bg-purple-800 rounded-lg border border-purple-600">
          <h2 className="text-2xl font-semibold mb-4">Connect your wallet to enter the magical realm</h2>
          <p className="text-purple-300 mb-6">
            Create spells, trade with other wizards, and unleash your magical powers!
          </p>
        </div>
      )}
    </div>
  )
}

