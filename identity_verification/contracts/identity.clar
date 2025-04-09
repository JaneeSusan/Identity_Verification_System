;; identity-registry.clar
;; Handles identity registration and management

(impl-trait .identity-traits.identity-registry-trait)

;; Data storage

;; Map of user principal to identity data
(define-map identities principal { data: (buff 256), active: bool })

;; Error codes
(define-constant ERR_NOT_FOUND u404)
(define-constant ERR_UNAUTHORIZED u401)
(define-constant ERR_ALREADY_EXISTS u409)

;; Functions

;; Register a new identity with the system
(define-public (register-identity (data (buff 256)))
  (let ((caller tx-sender))
    (asserts! (not (is-some (map-get? identities caller))) (err ERR_ALREADY_EXISTS))
    
    (map-set identities caller { data: data, active: true })
    (ok true)
  )
)

;; Update an existing identity's data
(define-public (update-identity (data (buff 256)))
  (let ((caller tx-sender))
    (asserts! (is-some (map-get? identities caller)) (err ERR_NOT_FOUND))
    
    (map-set identities caller (merge (unwrap-panic (map-get? identities caller)) { data: data }))
    (ok true)
  )
)

;; Get identity data for a principal
(define-read-only (get-identity-data (owner principal))
  (match (map-get? identities owner)
    identity (ok (get data identity))
    (err ERR_NOT_FOUND)
  )
)