# Blockchain Identity Registry

A secure, decentralized identity management system built on Clarity smart contracts.

## Overview

The Identity Registry is a blockchain-based solution that allows users to register, manage, and verify their digital identities in a decentralized manner. Built using Clarity smart contracts, this system provides a secure and transparent way for users to maintain ownership of their identity data while enabling controlled sharing with third parties.

## Features

- **Self-sovereign identity**: Users maintain full control over their identity data
- **Secure data storage**: All identity data is stored on-chain in encrypted format
- **Identity verification**: Simple mechanisms to prove ownership of registered identities
- **Privacy-preserving**: Users control who can access their identity information
- **Extensible**: Built using a trait-based approach for easy integration with other systems

## Technical Architecture

### Core Contracts

#### Identity Registry (`identity-registry.clar`)

The main contract that handles identity registration and management, implementing the `identity-registry-trait`. This contract provides the following functionality:

- Register a new identity with encrypted data
- Update existing identity information
- Retrieve identity data for authorized principals
- Deactivate/reactivate identities
- Check if an identity is active

### Data Structure

Identities are stored as a mapping between user principals (wallet addresses) and their associated data:

```clarity
(define-map identities principal { data: (buff 256), active: bool })
```

Where:
- `data`: A buffer containing encrypted identity data (up to 256 bytes)
- `active`: A boolean indicating whether the identity is currently active

## API Reference

### Public Functions

#### `register-identity`

Registers a new identity for the transaction sender.

```clarity
(define-public (register-identity (data (buff 256))))
```

Parameters:
- `data`: Buffer containing encrypted identity data

Returns:
- `(ok true)` on success
- `(err u409)` if the identity already exists

#### `update-identity`

Updates an existing identity's information.

```clarity
(define-public (update-identity (data (buff 256))))
```

Parameters:
- `data`: New encrypted identity data

Returns:
- `(ok true)` on success
- `(err u404)` if the identity doesn't exist

#### `deactivate-identity`

Deactivates an existing identity.

```clarity
(define-public (deactivate-identity (owner principal)))
```

Parameters:
- `owner`: Principal whose identity should be deactivated

Returns:
- `(ok true)` on success
- `(err u401)` if not authorized
- `(err u404)` if the identity doesn't exist

### Read-Only Functions

#### `get-identity-data`

Retrieves the data associated with an identity.

```clarity
(define-read-only (get-identity-data (owner principal)))
```

Parameters:
- `owner`: Principal whose identity data to retrieve

Returns:
- `(ok <data>)` on success
- `(err u404)` if the identity doesn't exist

#### `is-identity-active`

Checks if an identity is active.

```clarity
(define-read-only (is-identity-active (owner principal)))
```

Parameters:
- `owner`: Principal whose identity status to check

Returns:
- `(ok true/false)` indicating active status
- `(err u404)` if the identity doesn't exist

## Error Codes

The contract uses standard HTTP-style error codes:

- `u404`: Entity not found
- `u401`: Unauthorized action
- `u409`: Entity already exists

## Testing

The project includes comprehensive test coverage using Vitest. Tests verify all contract functionality including registration, updates, data retrieval, and error handling.

To run tests:

```bash
npm test
```

## Security Considerations

- All sensitive data should be encrypted before being stored on-chain
- Users should protect their private keys as they provide access to identity management
- The contract includes authorization checks to prevent unauthorized modifications

## Future Enhancements

- Multi-factor identity verification
- Delegated identity management
- Integration with verifiable credential systems
- Enhanced privacy features using zero-knowledge proofs

## License

[MIT License](LICENSE)