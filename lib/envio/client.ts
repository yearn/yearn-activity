import { GraphQLClient } from 'graphql-request';

const ENVIO_GRAPHQL_URL = process.env.ENVIO_GRAPHQL_URL || 'http://localhost:8080/v1/graphql';
const ENVIO_TOKEN = process.env.ENVIO_PASSWORD || '';

const headers: Record<string, string> = {};
if (ENVIO_TOKEN) {
  headers['Authorization'] = `Bearer ${ENVIO_TOKEN}`;
}

export const envioClient = new GraphQLClient(ENVIO_GRAPHQL_URL, {
  headers,
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
