
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

describe("SagaSpell Smart Contract Tests", () => {
  describe("Contract Initialization", () => {
    it("should initialize with correct default values", () => {
      const totalSpells = simnet.callReadOnlyFn("artherealms", "get-total-spells", [], deployer);
      expect(totalSpells.result).toBeOk(Cl.uint(0));

      const cooldown = simnet.callReadOnlyFn("artherealms", "get-casting-cooldown", [], deployer);
      expect(cooldown.result).toBeOk(Cl.uint(144));
    });
  });

  describe("Spell Creation", () => {
    it("should create a spell successfully", () => {
      const result = simnet.callPublicFn(
        "artherealms",
        "create-spell",
        [Cl.stringAscii("Fireball"), Cl.uint(75), Cl.uint(100)],
        address1
      );

      expect(result.result).toBeOk(Cl.uint(1));
    });

    it("should reject spell with invalid power level", () => {
      const result = simnet.callPublicFn(
        "artherealms",
        "create-spell",
        [Cl.stringAscii("Weak Spell"), Cl.uint(0), Cl.uint(100)],
        address1
      );

      expect(result.result).toBeErr(Cl.uint(105)); // ERR-INVALID-POWER-LEVEL
    });
  });
});
