# SagaSpell 🧙‍♂️✨

## Overview

SagaSpell is a decentralized magical spell management and trading smart contract built on the Stacks blockchain using Clarity. This enhanced version includes experience tracking, leveling systems, and advanced spell management features for a more immersive magical experience.

## Features

- 🔮 **Spell Creation**: Users can create unique spells with custom names, power levels, and prices
- 💸 **Spell Trading**: Spells can be listed for sale and purchased using STX tokens
- 🚀 **Ownership Management**: Strict ownership and access controls for spell interactions
- 🔒 **Secure Transactions**: Leveraging Stacks blockchain's security features
- ⭐ **Experience System**: Spells gain experience points and level up with each cast
- ⏰ **Cooldown Mechanism**: Configurable cooldown periods between spell casts
- 📊 **Advanced Tracking**: Comprehensive spell usage statistics and owner analytics
- 🛡️ **Enhanced Security**: Improved validation and error handling

## Smart Contract Structure

### Key Components

- **Spell Definition**: Each spell contains:
  - Unique Spell ID
  - Name (up to 50 characters)
  - Power Level (1-1000)
  - Creator/Owner
  - Price
  - Sale Status
  - Experience Points
  - Current Level
  - Total Cast Count
  - Last Cast Block Height

### Functions

#### Read Functions
- `get-spell`: Retrieve details of a specific spell
- `get-total-spells`: Get the total number of spells created
- `get-owner-spell-stats`: Get owner's spell statistics (count and total power)
- `get-spell-experience`: Get detailed spell experience information
- `get-casting-cooldown`: Get current cooldown period setting

#### Write Functions
- `create-spell`: Mint a new magical spell with power validation
- `list-spell-for-sale`: Put a spell up for sale
- `buy-spell`: Purchase a spell from another user
- `cast-spell`: Activate a spell (owner-only) with experience gain and cooldown
- `update-casting-cooldown`: Admin function to modify cooldown period

## Error Handling

The contract includes comprehensive error handling:
- `ERR-NOT-AUTHORIZED` (u100): Prevents unauthorized actions
- `ERR-SPELL-NOT-FOUND` (u101): Handles non-existent spell queries
- `ERR-INSUFFICIENT-BALANCE` (u102): Prevents transactions without sufficient funds
- `ERR-INVALID-PRICE` (u103): Ensures valid pricing for spells
- `ERR-SPELL-ON-COOLDOWN` (u104): Prevents casting spells during cooldown period
- `ERR-INVALID-POWER-LEVEL` (u105): Validates spell power within acceptable range
- `ERR-INVALID-COOLDOWN` (u106): Ensures valid cooldown period settings

## Prerequisites

- Stacks Blockchain
- Clarinet (for local development and testing)
- Hiro Wallet or compatible Stacks wallet

## Installation

### Local Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/sagaspell.git
cd sagaspell
```

2. Install Dependencies
```bash
npm install -g @stacks/cli
npm install -g clarinet
```

3. Deploy Local Network
```bash
clarinet develop
```

### Deployment

1. Configure your deployment settings in `Clarinet.toml`
2. Deploy using Clarinet or Stacks CLI
```bash
clarinet deployment generate
```

## Usage Examples

### Creating a Spell
```clarity
;; Create a spell with name, power (1-1000), and initial price
(contract-call? .artherealms create-spell "Fireball" u75 u100)
```

### Listing a Spell for Sale
```clarity
;; List spell ID 1 for sale at 500 STX
(contract-call? .artherealms list-spell-for-sale u1 u500)
```

### Buying a Spell
```clarity
;; Purchase spell ID 1
(contract-call? .artherealms buy-spell u1)
```

### Casting a Spell
```clarity
;; Cast spell ID 1 (gains experience, subject to cooldown)
(contract-call? .artherealms cast-spell u1)
```

### Checking Spell Experience
```clarity
;; Get experience details for spell ID 1
(contract-call? .artherealms get-spell-experience u1)
```

### Getting Owner Statistics
```clarity
;; Get spell statistics for a specific owner
(contract-call? .artherealms get-owner-spell-stats 'SP1234567890ABCDEF)
```

### Administrative Functions
```clarity
;; Update casting cooldown (admin only) - 72 blocks = ~12 hours
(contract-call? .artherealms update-casting-cooldown u72)
```

## Security Considerations

- Only spell owners can list or cast spells
- Strict price and power level validation (1-1000 range)
- Cooldown mechanism prevents spam casting
- Enhanced authorization checks for administrative functions
- Comprehensive error handling and input validation
- Transparent transaction logging on the Stacks blockchain

## Game Mechanics

### Experience and Leveling
- Spells gain 10 experience points per cast
- Level increases every 100 experience points
- Higher level spells retain their original power but show progression

### Cooldown System
- Default cooldown: 144 blocks (~24 hours)
- Prevents rapid consecutive spell casting
- Configurable by contract administrator
- Cooldown applies per individual spell

### Power Levels
- Valid range: 1-1000 power units
- Power level affects spell effectiveness
- Cannot be changed after spell creation

## Testing

The contract includes comprehensive unit tests covering:
- Spell creation with validation
- Experience tracking and leveling
- Cooldown mechanism enforcement
- Trading functionality
- Administrative functions
- Error handling and edge cases

Run tests with:
```bash
npm test
```

## Future Roadmap

- ✅ ~~Implement spell leveling system~~ (Completed)
- 🤝 Add spell trading/exchange mechanisms with level considerations
- 🏆 Create achievement/reputation system for spell creators
- 🔄 Implement spell fusion/combination mechanics
- 🎯 Add spell categories and elemental types
- 📈 Create leaderboards and ranking systems

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingSpell`)
3. Commit your changes (`git commit -m 'Add some magical feature'`)
4. Push to the branch (`git push origin feature/AmazingSpell`)
5. Open a Pull Request

## License

This project is open-source, licensed under the MIT License.

## Disclaimer

SagaSpell is an experimental project. Use at your own risk, and always perform thorough testing before deploying to mainnet.

---

**Created with ✨ by the BoluTifeh Games Team**