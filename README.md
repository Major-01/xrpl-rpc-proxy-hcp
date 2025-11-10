# XRPL RPC Proxy (Terraform + AWS Lambda + HCP)

Serverless, secure XRP Ledger JSON-RPC proxy.

## Features
- Terraform + HCP backend
- Multi-node failover
- Rate limiting
- Testnet/Mainnet toggle

## Deploy

```bash
terraform login
terraform init
terraform apply