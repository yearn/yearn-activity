import { GraphQLClient } from 'graphql-request';

const ENVIO_GRAPHQL_URL = process.env.ENVIO_GRAPHQL_URL || 'http://localhost:8080/v1/graphql';

const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    cache: 'no-store',
  });

export const envioClient = new GraphQLClient(ENVIO_GRAPHQL_URL, {
  fetch: noStoreFetch,
});

export async function queryEnvio<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const data = await envioClient.request<T>(query, variables);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Envio GraphQL Error:', error.message);

      if (error.message.includes('authentication')) {
        throw new Error('Invalid Envio credentials');
      }

      if (error.message.includes('timeout')) {
        throw new Error('Envio request timeout');
      }
    }

    throw new Error('Failed to query Envio indexer');
  }
}
