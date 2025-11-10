variable "project_name" {
  description = "Name of the project."
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)."
  type        = string
}

variable "rpc_endpoints" {
  description = "List of XRPL RPC endpoints."
  type        = list(string)
}

variable "rate_limit_rps" {
  description = "Rate limit in requests per second."
  type        = number
}

variable "burst_limit" {
  description = "Burst limit for rate limiting."
  type        = number
}