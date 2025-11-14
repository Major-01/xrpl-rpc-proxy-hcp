// lambda/index.js
const { Client } = require('xrpl');

const RPC_ENDPOINTS = (process.env.RPC_ENDPOINTS || "").split(",").filter(Boolean);
let clients = [];

async function connectClients() {
  console.log(`[XRPL] Connecting to ${RPC_ENDPOINTS.length} node(s):`, RPC_ENDPOINTS);
  clients = RPC_ENDPOINTS.map(endpoint => {
    const client = new Client(endpoint, {
      connectionTimeout: 15000,
      timeout: 20000
    });
    client.connect().catch(err => {
      console.warn(`[XRPL] Connect failed: ${endpoint}`, err.message);
    });
    return client;
  });
  await new Promise(r => setTimeout(r, 5000));
}

async function getHealthyClient(retries = 3) {
  for (let i = 0; i < retries; i++) {
    for (const client of clients) {
      if (client.isConnected()) {
        console.log(`[XRPL] Using: ${client.connection.url}`);
        return client;
      }
    }
    console.log(`[XRPL] Retrying ${i + 1}/${retries}...`);
    await connectClients();
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error("No XRPL node available");
}

exports.handler = async (event) => {
  const start = Date.now();
  try {
    const body = JSON.parse(event.body || "{}");
    const { method, params = [], id = 1 } = body;

    if (!method) throw new Error("Invalid method");

    const client = await getHealthyClient();
    const response = await client.request({ method, params });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", result: response.result, id })
    };
  } catch (err) {
    console.error("XRPL Error:", err.message);
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

connectClients();