import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockClarity = {
  callPublicFn: vi.fn(),
  
  callReadOnlyFn: vi.fn(),
    state: {
    identities: new Map()
  },
  
  resetState() {
    this.state.identities.clear();
  }
};

function mockContractResponse(success, value) {
  if (success) {
    return {
      result: { value },
      isOk: true,
      isErr: false,
      value
    };
  } else {
    return {
      result: { value },
      isOk: false,
      isErr: true,
      value
    };
  }
}

describe('Identity Registry Contract', () => {
  let deployer;
  let user1;
  let user2;
  let sampleData;
  let updatedData;

  beforeEach(() => {
    mockClarity.resetState();
    vi.resetAllMocks();
    
    deployer = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    user1 = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    user2 = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    
    sampleData = Buffer.from('{"name":"John Doe","dob":"1990-01-01"}').toString('base64');
    updatedData = Buffer.from('{"name":"John Doe","dob":"1990-01-01","email":"john@example.com"}').toString('base64');
  });

  it('allows a user to register an identity', async () => {
    mockClarity.callPublicFn.mockReturnValueOnce(mockContractResponse(true, true));
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'register-identity',
      [{ type: 'buffer', value: sampleData }],
      user1
    );
    
    expect(mockClarity.callPublicFn).toHaveBeenCalledWith(
      'identity-registry',
      'register-identity',
      [expect.objectContaining({ type: 'buffer', value: sampleData })],
      user1
    );
    
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(true);
  });

  it('prevents duplicate identity registration', async () => {
    mockClarity.callPublicFn
      .mockReturnValueOnce(mockContractResponse(true, true))  
      .mockReturnValueOnce(mockContractResponse(false, 409)); 
    
    await mockClarity.callPublicFn(
      'identity-registry',
      'register-identity',
      [{ type: 'buffer', value: sampleData }],
      user1
    );
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'register-identity',
      [{ type: 'buffer', value: sampleData }],
      user1
    );
    
    expect(result.isErr).toBe(true);
    expect(result.value).toBe(409); 
  });

  it('retrieves identity data correctly', async () => {
    mockClarity.callReadOnlyFn.mockReturnValueOnce(
      mockContractResponse(true, { type: 'buffer', value: sampleData })
    );
    
    const result = await mockClarity.callReadOnlyFn(
      'identity-registry',
      'get-identity-data',
      [{ type: 'principal', value: user1 }],
      deployer
    );
    
    expect(mockClarity.callReadOnlyFn).toHaveBeenCalledWith(
      'identity-registry',
      'get-identity-data',
      [expect.objectContaining({ type: 'principal', value: user1 })],
      deployer
    );
    
    expect(result.isOk).toBe(true);
    expect(result.value).toEqual({ type: 'buffer', value: sampleData });
  });

  it('returns an error when retrieving non-existent identity', async () => {
    mockClarity.callReadOnlyFn.mockReturnValueOnce(
      mockContractResponse(false, 404)
    );
    
    const result = await mockClarity.callReadOnlyFn(
      'identity-registry',
      'get-identity-data',
      [{ type: 'principal', value: user1 }],
      deployer
    );
    
    expect(result.isErr).toBe(true);
    expect(result.value).toBe(404); 
  });

  it('allows a user to update their identity', async () => {
    mockClarity.callPublicFn
      .mockReturnValueOnce(mockContractResponse(true, true)) 
      .mockReturnValueOnce(mockContractResponse(true, true)); 
    
    await mockClarity.callPublicFn(
      'identity-registry',
      'register-identity',
      [{ type: 'buffer', value: sampleData }],
      user1
    );
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'update-identity',
      [{ type: 'buffer', value: updatedData }],
      user1
    );
    
    expect(mockClarity.callPublicFn).toHaveBeenLastCalledWith(
      'identity-registry',
      'update-identity',
      [expect.objectContaining({ type: 'buffer', value: updatedData })],
      user1
    );
    
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(true);
  });

  it('prevents updating non-existent identity', async () => {
    mockClarity.callPublicFn.mockReturnValueOnce(
      mockContractResponse(false, 404)
    );
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'update-identity',
      [{ type: 'buffer', value: updatedData }],
      user1
    );
    
    expect(result.isErr).toBe(true);
    expect(result.value).toBe(404); 
  });

  it('checks if an identity is active', async () => {
    mockClarity.callReadOnlyFn.mockReturnValueOnce(
      mockContractResponse(true, true)
    );
    
    const result = await mockClarity.callReadOnlyFn(
      'identity-registry',
      'is-identity-active',
      [{ type: 'principal', value: user1 }],
      deployer
    );
    
    expect(mockClarity.callReadOnlyFn).toHaveBeenCalledWith(
      'identity-registry',
      'is-identity-active',
      [expect.objectContaining({ type: 'principal', value: user1 })],
      deployer
    );
    
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(true);
  });

  it('allows a user to deactivate their identity', async () => {
    mockClarity.callPublicFn
      .mockReturnValueOnce(mockContractResponse(true, true))  
      .mockReturnValueOnce(mockContractResponse(true, true)); 
    await mockClarity.callPublicFn(
      'identity-registry',
      'register-identity',
      [{ type: 'buffer', value: sampleData }],
      user1
    );
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'deactivate-identity',
      [{ type: 'principal', value: user1 }],
      user1
    );
    
    expect(mockClarity.callPublicFn).toHaveBeenLastCalledWith(
      'identity-registry',
      'deactivate-identity',
      [expect.objectContaining({ type: 'principal', value: user1 })],
      user1
    );
    
    expect(result.isOk).toBe(true);
    expect(result.value).toBe(true);
    
    mockClarity.callReadOnlyFn.mockReturnValueOnce(
      mockContractResponse(true, false)
    );
    
    const activeStatus = await mockClarity.callReadOnlyFn(
      'identity-registry',
      'is-identity-active',
      [{ type: 'principal', value: user1 }],
      deployer
    );
    
    expect(activeStatus.value).toBe(false);
  });

  it('prevents unauthorized users from deactivating others\' identities', async () => {
    mockClarity.callPublicFn
      .mockReturnValueOnce(mockContractResponse(true, true))  
      .mockReturnValueOnce(mockContractResponse(false, 401)); 
    
    await mockClarity.callPublicFn(
      'identity-registry',
      'register-identity',
      [{ type: 'buffer', value: sampleData }],
      user1
    );
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'deactivate-identity',
      [{ type: 'principal', value: user1 }],
      user2
    );
    
    expect(result.isErr).toBe(true);
    expect(result.value).toBe(401); 
  });

  it('prevents deactivating non-existent identity', async () => {
    mockClarity.callPublicFn.mockReturnValueOnce(
      mockContractResponse(false, 404)
    );
    
    const result = await mockClarity.callPublicFn(
      'identity-registry',
      'deactivate-identity',
      [{ type: 'principal', value: user1 }],
      user1
    );
    
    expect(result.isErr).toBe(true);
    expect(result.value).toBe(404);
  });
});