import { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://hqmqd5448l.execute-api.us-east-1.amazonaws.com'; // YOUR API
const [xrpBalance, setXrpBalance] = useState('');


function App() {
  const [method, setMethod] = useState('server_info');
  const [account, setAccount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const callXRPL = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    useEffect(() => {
      if (result?.result?.account_data?.Balance) {
        const drops = parseInt(result.result.account_data.Balance);
        const xrp = (drops / 1000000).toFixed(6).replace(/\.?0+$/, '');
        setXrpBalance(xrp);  // ← New state
      }
    }, [result]);

    {xrpBalance && (
  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-center shadow-lg">
    <p className="text-4xl font-bold text-green-700">{xrpBalance} XRP</p>
    <p className="text-sm text-gray-600 mt-2">Mainnet Balance</p>
  </div>
)}


  {result?.xrp && (
  <div className="mt-4 p-4 bg-green-50 rounded-lg">
    <p className="font-bold">Balance: {result.xrp} XRP</p>
  </div>
  )}

    try {
      const payload = {
        jsonrpc: "2.0",
        method,
        params: method === 'account_info' ? [{ account }] : [],
        id: 1
      };

      const res = await axios.post(API_URL, payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-900">
          XRPL Proxy Explorer
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Powered by AWS Lambda + Terraform
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="server_info">server_info</option>
              <option value="account_info">account_info</option>
              <option value="ledger">ledger</option>
              <option value="account_tx">account_tx</option>
            </select>
          </div>

          {method === 'account_info' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <input
                type="text"
                placeholder="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <button
            onClick={callXRPL}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Call XRPL'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <pre className="text-sm text-red-700">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;