
;; identity-traits.clar
;; Define interfaces for the identity system

(define-trait identity-registry-trait
  (
    (register-identity (principal (buff 256)) (response bool uint))
    (update-identity (principal (buff 256)) (response bool uint))
    (get-identity-data (principal) (response (buff 256) uint))
    (deactivate-identity (principal) (response bool uint))
    (is-identity-active (principal) (response bool uint))
  )
)

(define-trait credential-issuer-trait
  (
    (issue-credential (principal (string-ascii 64) (buff 1024)) (response uint uint))
    (revoke-credential (uint) (response bool uint))
    (is-credential-valid (uint) (response bool uint))
    (get-credential-data (uint) (response {owner: principal, type: (string-ascii 64), data: (buff 1024), issuer: principal, valid: bool} uint))
  )
)

(define-trait credential-verifier-trait
  (
    (verify-credential (uint) (response bool uint))
    (verify-credential-by-type (principal (string-ascii 64)) (response (optional uint) uint))
  )
)

