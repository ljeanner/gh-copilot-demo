# Terraform – Azure Container Apps Deployment

This directory contains Terraform templates to deploy the **album-api** and **album-viewer**
Container Apps on Azure, mirroring the existing Bicep deployment in `../bicep/`.

## Resources Created

| Resource | Description |
|---|---|
| `azurerm_resource_group` | Resource group for all resources |
| `azurerm_log_analytics_workspace` | Log Analytics workspace for monitoring |
| `azurerm_container_app_environment` | Managed Container Apps environment |
| `azurerm_container_app` (album-api) | .NET 8 API, external ingress on port 80 |
| `azurerm_container_app` (album-viewer) | Vue.js/Vite frontend, external ingress on port 3000 |

## Prerequisites

- [Terraform ≥ 1.3](https://developer.hashicorp.com/terraform/downloads)
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) (authenticated via `az login`)
- An **Azure Container Registry** with the `album-api` and `album-viewer` images already pushed.
  Images can be built with:
  ```bash
  az acr build --image album-api:latest   --registry <ACR_NAME> ../../albums-api/
  az acr build --image album-viewer:latest --registry <ACR_NAME> ../../album-viewer/
  ```

## Usage

### 1. Configure variables

Copy the example variables file and fill in your values:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
resource_group_name          = "rg-album-demo"
location                     = "eastus"
log_analytics_workspace_name = "log-album-demo"
container_apps_env_name      = "env-album-demo"

registry_name     = "<ACR_NAME>"
registry_username = "<ACR_USERNAME>"
registry_password = "<ACR_PASSWORD>"   # from: az acr credential show -n <ACR_NAME>

api_image    = "<ACR_NAME>.azurecr.io/album-api:latest"
viewer_image = "<ACR_NAME>.azurecr.io/album-viewer:latest"
```

> **Tip:** Retrieve your ACR credentials with:
> ```bash
> az acr credential show --name <ACR_NAME>
> ```

### 2. Initialise, plan, and apply

```bash
cd iac/terraform
terraform init
terraform plan
terraform apply
```

### 3. Access the deployed applications

After `terraform apply` completes the FQDNs are printed as outputs:

```
album_api_fqdn    = "https://album-api.<hash>.eastus.azurecontainerapps.io"
album_viewer_fqdn = "https://album-viewer.<hash>.eastus.azurecontainerapps.io"
```

## File Overview

| File | Purpose |
|---|---|
| `main.tf` | Terraform and provider configuration |
| `variables.tf` | Input variable declarations |
| `container-apps.tf` | Azure resources (Resource Group, Log Analytics, Container Apps) |
| `terraform.tfvars.example` | Example variable values – copy to `terraform.tfvars` |
| `apps.tf` | Legacy: ACR image builds (pre-existing file) |

## Cleanup

```bash
terraform destroy
```
