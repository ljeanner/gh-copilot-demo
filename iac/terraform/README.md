# Terraform – Azure Container Apps deployment for the Albums application

This directory contains Terraform configuration that deploys the **Albums** application to [Azure Container Apps](https://learn.microsoft.com/azure/container-apps/).  
It provisions the same core resources as the Bicep reference in [`iac/bicep/main.bicep`](../bicep/main.bicep):

| Resource | Purpose |
|---|---|
| Log Analytics Workspace | Container log aggregation |
| Application Insights | Dapr telemetry |
| Storage Account + Blob Container | Dapr state store backend |
| Container Apps Environment | Shared managed environment |
| Dapr component (`statestore`) | `state.azure.blobstorage` scoped to `album-api` |
| Container App – `album-api` | .NET 8 REST API, port 80 |
| Container App – `album-viewer` | Vue.js 3 frontend, port 3000 |

---

## Prerequisites

- [Terraform ≥ 1.3](https://developer.hashicorp.com/terraform/downloads)
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli) – authenticated (`az login`)
- An existing Azure resource group
- Container images for both services already pushed to a registry

---

## Quick start

### 1. Authenticate

```bash
az login
az account set --subscription "<your-subscription-id>"
```

### 2. Initialize

```bash
cd iac/terraform
terraform init
```

### 3. Create a `terraform.tfvars` file

Create a file named `terraform.tfvars` in this directory (it is git-ignored so secrets stay out of source control):

```hcl
resource_group_name = "rg-albums"

# Container registry
registry_server   = "myregistry.azurecr.io"
registry_username = "myregistry"
registry_password = "<acr-password-or-token>"   # keep secret

# Image references – built via CI and pushed to your registry
api_image    = "myregistry.azurecr.io/albums-api:latest"
viewer_image = "myregistry.azurecr.io/album-viewer:latest"

# Storage account name must be globally unique, 3-24 lowercase alphanumeric chars
storage_account_name = "storagealbums<unique-suffix>"

# Optional overrides (defaults shown)
# location                     = "eastus"
# container_apps_env_name      = "env-albums"
# log_analytics_workspace_name = "log-albums"
# app_insights_name            = "appinsights-albums"
# blob_container_name          = "albums"
```

> **Tip:** Sensitive values can also be passed via environment variables:  
> `export TF_VAR_registry_password="<value>"`

### 4. Plan

Review what Terraform will create before applying:

```bash
terraform plan
```

### 5. Apply

```bash
terraform apply
```

After a successful apply the URLs for both services are printed as outputs:

```
album_api_fqdn    = "album-api.<unique>.eastus.azurecontainerapps.io"
album_viewer_fqdn = "album-viewer.<unique>.eastus.azurecontainerapps.io"
```

### 6. Destroy

To tear down all provisioned resources:

```bash
terraform destroy
```

---

## Variable reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `resource_group_name` | ✅ | – | Existing Azure resource group |
| `registry_server` | ✅ | – | Registry hostname (`myregistry.azurecr.io`) |
| `registry_username` | ✅ | – | Registry username |
| `registry_password` | ✅ | – | Registry password / token (**sensitive**) |
| `api_image` | ✅ | – | Full image ref for `album-api` |
| `viewer_image` | ✅ | – | Full image ref for `album-viewer` |
| `location` | ☐ | resource group location | Azure region |
| `container_apps_env_name` | ☐ | `env-albums` | Container Apps Environment name |
| `log_analytics_workspace_name` | ☐ | `log-albums` | Log Analytics Workspace name |
| `app_insights_name` | ☐ | `appinsights-albums` | Application Insights name |
| `storage_account_name` | ✅ | – | Storage account name (globally unique, 3-24 lowercase alphanumeric) |
| `blob_container_name` | ☐ | `albums` | Blob container name |
