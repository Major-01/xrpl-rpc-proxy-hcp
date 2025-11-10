const { handler } = require('./index');  // Your Lambda handler

// Simulate API Gateway event (same as cURL body)
const event = {
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "server_info",
    params: [],
    id: 1
  }),
  headers: { "Content-Type": "application/json" }
};

// Run it
(async () => {
  const response = await handler(event);
  console.log('Local Response:', JSON.stringify(response, null, 2));
})();