const { handler } = require('./index.js');

const event = {
  body: JSON.stringify({
    jsonrpc: "2.0",
    method: "server_info",
    params: [],
    id: 1
  })
};

handler(event).then(console.log).catch(console.error);
