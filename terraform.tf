terraform {
  cloud {
    organization = "Major-Terraform-Trainings"
    workspaces {
      name = "xrpl-rpc-proxy-project"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}