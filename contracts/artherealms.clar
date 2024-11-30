;; SagaSpell - A magical spell casting and trading contract
;; Contract that allows users to create, trade, and cast magical spells

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-SPELL-NOT-FOUND (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))
(define-constant ERR-INVALID-PRICE (err u103))

;; Data variables
(define-data-var contract-owner principal tx-sender)
(define-data-var spell-counter uint u0)

;; Data maps
(define-map spells
    { spell-id: uint }
    {
        name: (string-ascii 50),
        power: uint,
        creator: principal,
        price: uint,
        is-for-sale: bool
    }
)

(define-map spell-owners
    { owner: principal }
    { spell-count: uint }
)

;; Get spell details
(define-read-only (get-spell (spell-id uint))
    (match (map-get? spells { spell-id: spell-id })
        spell-data (ok spell-data)
        (err ERR-SPELL-NOT-FOUND)
    )
)

;; Create new spell
(define-public (create-spell (name (string-ascii 50)) (power uint) (price uint))
    (let
        (
            (new-spell-id (+ (var-get spell-counter) u1))
            (creator tx-sender)
        )
        (map-set spells
            { spell-id: new-spell-id }
            {
                name: name,
                power: power,
                creator: creator,
                price: price,
                is-for-sale: false
            }
        )
        (var-set spell-counter new-spell-id)
        (ok new-spell-id)
    )
)

;; Put spell up for sale
(define-public (list-spell-for-sale (spell-id uint) (price uint))
    (let
        ((spell (unwrap! (map-get? spells { spell-id: spell-id }) (err ERR-SPELL-NOT-FOUND))))
        (begin
            (asserts! (is-eq tx-sender (get creator spell)) (err ERR-NOT-AUTHORIZED))
            (asserts! (> price u0) (err ERR-INVALID-PRICE))
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
            (spell (unwrap! (map-get? spells { spell-id: spell-id }) (err ERR-SPELL-NOT-FOUND)))
            (price (get price spell))
        )
        (begin
            (asserts! (get is-for-sale spell) (err ERR-NOT-AUTHORIZED))
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
        ((spell (unwrap! (map-get? spells { spell-id: spell-id }) (err ERR-SPELL-NOT-FOUND))))
        (begin
            (asserts! (is-eq tx-sender (get creator spell)) (err ERR-NOT-AUTHORIZED))
            (ok (get power spell))
        )
    )
)

;; Get total number of spells
(define-read-only (get-total-spells)
    (ok (var-get spell-counter))
)