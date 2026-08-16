import type { LoginRequest } from '@bopacorp/shared/auth';

const invalidLoginRequest: LoginRequest = {
  email: 'user@bopacorp.com',
  password: 'Password1!',
  notAContractField: true,
};

void invalidLoginRequest;
