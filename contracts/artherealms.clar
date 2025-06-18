;; SagaSpell - A magical spell casting and trading contract
;; Contract that allows users to create, trade, and cast magical spells
;; Enhanced with experience system, cooldown mechanism, and advanced tracking

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-SPELL-NOT-FOUND (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-PRICE (err u103))
(define-constant ERR-SPELL-ON-COOLDOWN (err u104))
(define-constant ERR-INVALID-POWER-LEVEL (err u105))
(define-constant ERR-INVALID-COOLDOWN (err u106))

;; Constants
(define-constant MAX-POWER-LEVEL u1000)
(define-constant MIN-POWER-LEVEL u1)
(define-constant EXPERIENCE-PER-CAST u10)
(define-constant EXPERIENCE-PER-LEVEL u100)

;; Data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var spell-counter uint u0)
(define-data-var casting-cooldown uint u144) ;; Default 144 blocks (~24 hours)

;; Data maps
(define-map spells
    { spell-id: uint }
    {
        name: (string-ascii 50),
        power: uint,
        creator: principal,
        price: uint,
        is-for-sale: bool,
        experience: uint,
        level: uint,
        total-casts: uint,
        last-cast-block: uint
    }
)

(define-map spell-owners
    { owner: principal }
    {
        spell-count: uint,
        total-power: uint
    }
)

(define-map spell-cooldowns
    { spell-id: uint }
    { last-cast-block: uint }
)

;; Helper functions
(define-private (calculate-level (experience uint))
    (/ experience EXPERIENCE-PER-LEVEL)
)

(define-private (is-spell-on-cooldown (spell-id uint))
    (let
        ((cooldown-data (map-get? spell-cooldowns { spell-id: spell-id })))
        (match cooldown-data
            data (> (+ (get last-cast-block data) (var-get casting-cooldown)) stacks-block-height)
            false
        )
    )
)

;; Read-only functions
(define-read-only (get-spell (spell-id uint))
    (match (map-get? spells { spell-id: spell-id })
        spell-data (ok spell-data)
        ERR-SPELL-NOT-FOUND
    )
)

(define-read-only (get-owner-spell-stats (owner principal))
    (match (map-get? spell-owners { owner: owner })
        stats (ok stats)
        (ok { spell-count: u0, total-power: u0 })
    )
)

(define-read-only (get-spell-experience (spell-id uint))
    (match (map-get? spells { spell-id: spell-id })
        spell-data (ok {
            experience: (get experience spell-data),
            level: (get level spell-data),
            total-casts: (get total-casts spell-data)
        })
        ERR-SPELL-NOT-FOUND
    )
)

(define-read-only (get-casting-cooldown)
    (ok (var-get casting-cooldown))
)

;; Public functions
(define-public (create-spell (name (string-ascii 50)) (power uint) (price uint))
    (let
        (
            (new-spell-id (+ (var-get spell-counter) u1))
            (creator tx-sender)
            (current-stats (default-to { spell-count: u0, total-power: u0 }
                                      (map-get? spell-owners { owner: creator })))
        )
        (begin
            ;; Validate power level
            (asserts! (and (>= power MIN-POWER-LEVEL) (<= power MAX-POWER-LEVEL))
                     ERR-INVALID-POWER-LEVEL)
            (asserts! (> price u0) ERR-INVALID-PRICE)

            ;; Create spell
            (map-set spells
                { spell-id: new-spell-id }
                {
                    name: name,
                    power: power,
                    creator: creator,
                    price: price,
                    is-for-sale: false,
                    experience: u0,
                    level: u1,
                    total-casts: u0,
                    last-cast-block: u0
                }
            )

            ;; Update owner stats
            (map-set spell-owners
                { owner: creator }
                {
                    spell-count: (+ (get spell-count current-stats) u1),
                    total-power: (+ (get total-power current-stats) power)
                }
            )

            (var-set spell-counter new-spell-id)
            (ok new-spell-id)
        )
    )
)

;; Put spell up for sale
(define-public (list-spell-for-sale (spell-id uint) (price uint))
    (let
        ((spell (unwrap! (map-get? spells { spell-id: spell-id }) ERR-SPELL-NOT-FOUND)))
        (begin
            (asserts! (is-eq tx-sender (get creator spell)) ERR-NOT-AUTHORIZED)
            (asserts! (> price u0) ERR-INVALID-PRICE)
            (map-set spells
                { spell-id: spell-id }
                (merge spell { 
                    price: price,
                    is-for-sale: true
                })
            )
            (ok true)
        )
    )
)

;; Buy spell
(define-public (buy-spell (spell-id uint))
    (let
        (
            (spell (unwrap! (map-get? spells { spell-id: spell-id }) ERR-SPELL-NOT-FOUND))
            (price (get price spell))
        )
        (begin
            (asserts! (get is-for-sale spell) ERR-NOT-AUTHORIZED)
            (map-set spells
                { spell-id: spell-id }
                (merge spell {
                    creator: tx-sender,
                    is-for-sale: false
                })
            )
            (ok true)
        )
    )
)

;; Cast spell (can only be done by owner)
(define-public (cast-spell (spell-id uint))
    (let
        (
            (spell (unwrap! (map-get? spells { spell-id: spell-id }) ERR-SPELL-NOT-FOUND))
            (new-experience (+ (get experience spell) EXPERIENCE-PER-CAST))
            (new-level (+ (calculate-level new-experience) u1))
            (new-total-casts (+ (get total-casts spell) u1))
        )
        (begin
            ;; Authorization check
            (asserts! (is-eq tx-sender (get creator spell)) ERR-NOT-AUTHORIZED)

            ;; Cooldown check
            (asserts! (not (is-spell-on-cooldown spell-id)) ERR-SPELL-ON-COOLDOWN)

            ;; Update spell with new experience and stats
            (map-set spells
                { spell-id: spell-id }
                (merge spell {
                    experience: new-experience,
                    level: new-level,
                    total-casts: new-total-casts,
                    last-cast-block: stacks-block-height
                })
            )

            ;; Update cooldown
            (map-set spell-cooldowns
                { spell-id: spell-id }
                { last-cast-block: stacks-block-height }
            )

            (ok {
                power: (get power spell),
                level: new-level,
                experience: new-experience
            })
        )
    )
)

;; Administrative functions
(define-public (update-casting-cooldown (new-cooldown uint))
    (begin
        (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-AUTHORIZED)
        (asserts! (> new-cooldown u0) ERR-INVALID-COOLDOWN)
        (var-set casting-cooldown new-cooldown)
        (ok true)
    )
)

;; Get total number of spells
(define-read-only (get-total-spells)
    (ok (var-get spell-counter))
)