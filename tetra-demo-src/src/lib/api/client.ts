// Tetra Connect TypeScript Client
import { createConnectTransport } from '@connectrpc/connect-web';
import { createPromiseClient } from '@connectrpc/connect';
import { GraphService, ConfigService, HealthService, AlgorithmService } from './gen/retina/v1/retina_connect.js';

let sessionToken: string | null = null;

export function setSessionToken(token: string | null) {
  sessionToken = token;
}

const transport = createConnectTransport({
  baseUrl: '/',
  useBinaryFormat: true,
  interceptors: [
    (next) => async (req) => {
      if (sessionToken) {
        req.header.set('authorization', `Bearer ${sessionToken}`);
      }
      return await next(req);
    }
  ]
});

export const graphClient = createPromiseClient(GraphService, transport);
export const configClient = createPromiseClient(ConfigService, transport);
export const healthClient = createPromiseClient(HealthService, transport);
export const algorithmClient = createPromiseClient(AlgorithmService, transport);
