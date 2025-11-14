// lambda/index.js
const { Client } = require('xrpl');

console.log("[STARTUP] Lambda initializing..."); // ← THIS WILL SHOW

const RPC_ENDPOINTS = (process.env.RPC_ENDPOINTS || "").split(",").filter(Boolean);
let clients = [];

async function connectClients() {
  console.log(`[XRPL] Connecting to ${RPC_ENDPOINTS.length} node(s):`, RPC_ENDPOINTS);
  clients = RPC_ENDPOINTS.map(endpoint => {
    const client = new Client(endpoint, { connectionTimeout: 10000, timeout: 15000 });
    client.on('connected', () => console.log(`[XRPL] Connected: ${endpoint}`));
    client.on('error', (err) => console.error(`[XRPL] Error: ${endpoint}`, err.message));
    client.connect().catch(err => console.error(`[XRPL] Connect failed: ${endpoint}`, err.message));
    return client;
  });
  await new Promise(r => setTimeout(r, 8000));
}

async function getHealthyClient() {
  for (const client of clients) {
    if (client.isConnected()) return client;
  }
  await connectClients();
  for (const client of clients) {
    if (client.isConnected()) return client;
  }
  throw new Error("No XRPL node available");
}

exports.handler = async (event) => {
  console.log("[REQUEST] Event:", event.body); // ← LOG EVERY REQUEST

  try {
    const body = JSON.parse(event.body || "{}");
    const { command, params = [], id = 1 } = body;
    if (!command) throw new Error("Missing command");

    const client = await getHealthyClient();
    const request = { command };
    if (params.length > 0) Object.assign(request, params[0]);

    const response = await client.request(request);
    return {
      statusCode: 200,
      body: JSON.stringify({ jsonrpc: "2.0", result: response.result, id })
    };
  } catch (err) {
    console.error("[ERROR]", err.message);
    return {
      statusCode: 502,
      body: JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32603, message: "XRPL node unreachable" },
        id: 1
      })
    };
  }
};

// Connect on cold start
connectClients();