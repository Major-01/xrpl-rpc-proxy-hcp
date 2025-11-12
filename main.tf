module "xrpl_proxy" {
  source = "./modules/xrpl-proxy"

  project_name   = "xrpl-rpc-proxy"
  environment    = "prod"
  rpc_endpoints  = [
    "wss://s1.ripple.com",        # Official Ripple Mainnet
    "wss://s2.ripple.com",        # Ripple backup
    "wss://xrplcluster.com"       # Community node
  ]
  rate_limit_rps = 10
  burst_limit    = 20
}