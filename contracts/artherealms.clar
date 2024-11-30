;; SagaSpell - Enhanced Magical Spell Management Contract

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-SPELL-NOT-FOUND (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-PRICE (err u103))
(define-constant ERR-SPELL-COOLDOWN (err u104))
(define-constant ERR-INSUFFICIENT-POWER (err u105))

;; Contract owner and settings
(define-data-var contract-owner principal tx-sender)
(define-data-var spell-counter uint u0)
(define-data-var casting-cooldown-blocks uint u10) ;; Default 10 blocks cooldown
(define-data-var max-spell-power uint u100) ;; Maximum spell power limit

;; Spell data structure
(define-map spells
    { spell-id: uint }
    {
        name: (string-ascii 50),
        power: uint,
        creator: principal,
        price: uint,
        is-for-sale: bool,
        last-cast-block: uint,
        total-casts: uint
    }
)

;; Spell ownership tracking
(define-map spell-owners
    { owner: principal }
    { 
        spell-count: uint,
        total-spell-power: uint 
    }
)

;; Spell experience and leveling system
(define-map spell-experience
    { spell-id: uint }
    {
        experience-points: uint,
        level: uint
    }
)

;; Get spell details
(define-read-only (get-spell (spell-id uint))
    (match (map-get? spells { spell-id: spell-id })
        spell-data (ok spell-data)
        (err ERR-SPELL-NOT-FOUND)
    )
)

;; Create new spell with enhanced metadata
(define-public (create-spell 
    (name (string-ascii 50)) 
    (power uint) 
    (price uint)
)
    (begin
        ;; Validate spell power
        (asserts! (<= power (var-get max-spell-power)) (err ERR-INSUFFICIENT-POWER))
        
        (let
            (
                (new-spell-id (+ (var-get spell-counter) u1))
                (creator tx-sender)
                (owner-stats (default-to 
                    { spell-count: u0, total-spell-power: u0 } 
                    (map-get? spell-owners { owner: creator })
                ))
            )
            ;; Set spell details
            (map-set spells
                { spell-id: new-spell-id }
                {
                    name: name,
                    power: power,
                    creator: creator,
                    price: price,
                    is-for-sale: false,
                    last-cast-block: u0,
                    total-casts: u0
                }
            )
            
            ;; Update spell experience
            (map-set spell-experience 
                { spell-id: new-spell-id }
                {
                    experience-points: u0,
                    level: u1
                }
            )
            
            ;; Update owner statistics
            (map-set spell-owners 
                { owner: creator }
                {
                    spell-count: (+ (get spell-count owner-stats) u1),
                    total-spell-power: (+ (get total-spell-power owner-stats) power)
                }
            )
            
            ;; Increment spell counter
            (var-set spell-counter new-spell-id)
            
            (ok new-spell-id)
        )
    )
)

;; Enhanced spell casting with cooldown and experience
(define-public (cast-spell (spell-id uint))
    (let
        (
            (spell (unwrap! (map-get? spells { spell-id: spell-id }) (err ERR-SPELL-NOT-FOUND)))
            (current-block u800)
            (spell-exp (unwrap! (map-get? spell-experience { spell-id: spell-id }) (err ERR-SPELL-NOT-FOUND)))
        )
        (begin
            ;; Check spell ownership
            (asserts! (is-eq tx-sender (get creator spell)) (err ERR-NOT-AUTHORIZED))
            
            ;; Check cooldown
            (asserts! 
                (>= current-block 
                    (+ (get last-cast-block spell) (var-get casting-cooldown-blocks))
                ) 
                (err ERR-SPELL-COOLDOWN)
            )
            
            ;; Update spell metadata
            (map-set spells
                { spell-id: spell-id }
                (merge spell { 
                    last-cast-block: current-block,
                    total-casts: (+ (get total-casts spell) u1)
                })
            )
            
            ;; Add experience points
            (map-set spell-experience
                { spell-id: spell-id }
                {
                    experience-points: (+ (get experience-points spell-exp) u10),
                    level: (/ (+ (get experience-points spell-exp) u10) u100)
                }
            )
            
            (ok (get power spell))
        )
    )
)

;; Administrative functions for contract management
(define-public (update-casting-cooldown (new-cooldown uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) (err ERR-NOT-AUTHORIZED))
        (var-set casting-cooldown-blocks new-cooldown)
        (ok true)
    )
)

;; Get owner spell statistics
(define-read-only (get-owner-spell-stats (owner principal))
    (ok (default-to 
        { spell-count: u0, total-spell-power: u0 }
        (map-get? spell-owners { owner: owner })
    ))
)

;; Get spell experience details
(define-read-only (get-spell-experience (spell-id uint))
    (ok (default-to 
        { experience-points: u0, level: u1 }
        (map-get? spell-experience { spell-id: spell-id })
    ))
)

;; Total number of spells
(define-read-only (get-total-spells)
    (ok (var-get spell-counter))
)