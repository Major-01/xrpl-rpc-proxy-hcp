module "xrpl_proxy" {
  source = "./modules/xrpl-proxy"

  project_name   = "xrpl-rpc-proxy"
  environment    = "devl"
  rpc_endpoints  = [
  "wss://s.altnet.rippletest.net:51233",  # Official Ripple testnet 
  "wss://testnet.xrpl-labs.com",          # XRPL Labs (very stable)
  "wss://s.testnet.ripple.com:51233"      # Ripple-hosted fallback
  ]
  rate_limit_rps = 10
  burst_limit    = 20
}