module "xrpl_proxy" {
  source = "./modules/xrpl-proxy"

  project_name   = "xrpl-rpc-proxy"
  environment    = "prod"
  rpc_endpoints  = [
    "wss://stylish-broken-reel.xrp-mainnet.quiknode.pro/cbb31b9a639b2f38f2c7aa36635302e0c493bfcb/"
  ]
  rate_limit_rps = 10
  burst_limit    = 20
}