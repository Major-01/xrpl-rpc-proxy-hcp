// lambda/index.js
const { Client } = require('xrpl');

// HARDCODED FOR TESTING — REMOVE LATER
const RPC_ENDPOINTS = [
  "wss://s.altnet.rippletest.net:51233"
  // "wss://testnet.xrpl-labs.com"  // Uncomment for fallback
];
const NETWORK = "mainnet";

let clients = [];

async function connectClients() {
  console.log(`[XRPL] Connecting to ${RPC_ENDPOINTS.length} node(s)...`);
  clients = RPC_ENDPOINTS.map(endpoint => {
    const client = new Client(endpoint, {
      connectionTimeout: 10000,
      timeout: 15000
    });
    client.connect().catch(err => {
      console.warn(`[XRPL] Failed to connect to ${endpoint}:`, err.message);
    });
    return client;
  });
  await new Promise(r => setTimeout(r, 3000)); // Wait for connections
}

async function getHealthyClient() {
  for (const client of clients) {
    if (client.isConnected()) {
      console.log(`[XRPL] Connected to: ${client.connection.url}`);
      return client;
    }
  }
  console.log("[XRPL] No healthy client, reconnecting...");
  await connectClients();
  await new Promise(r => setTimeout(r, 2000));
  for (const client of clients) {
    if (client.isConnected()) return client;
  }
  throw new Error("No XRPL node available");
}

exports.handler = async (event) => {
  const start = Date.now();

  try {
    const body = JSON.parse(event.body || "{}");
    const { method, params = [], id = 1 } = body;

    if (!method) {
      return { statusCode: 400, body: JSON.stringify({ error: "Invalid method" }) };
    }

    const client = await getHealthyClient();
    const response = await client.request({ method, params });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        result: response.result,
        id
      })
    };

  } catch (err) {
    console.error("XRPL Proxy Error:", err.message);
    return {
      statusCode: 502,
      body: JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32603, message: "XRPL node unreachable" },
        id: event.body?.id || 1
      })
    };
  } finally {
    console.log(`Request took: ${Date.now() - start}ms`);
  }
};

// Connect on cold start
connectClients();