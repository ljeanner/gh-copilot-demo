# ---------------------------------------------------------------------------
# Azure Container Apps – Albums Application
# ---------------------------------------------------------------------------
# Provisions the same core resources as iac/bicep/main.bicep:
#   • Log Analytics Workspace
#   • Application Insights
#   • Storage Account + Blob Container  (Dapr state store)
#   • Azure Container Apps Environment
#   • Dapr state-store component (state.azure.blobstorage)
#   • album-api  Container App  (target port 80)
#   • album-viewer Container App (target port 3000)
# ---------------------------------------------------------------------------

terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      # ~> 3.45 is the minimum that supports azurerm_container_app_environment_dapr_component
      version = "~> 3.45"
    }
  }
  required_version = ">= 1.3"
}

provider "azurerm" {
  features {}
}

# ---------------------------------------------------------------------------
# Existing resource group
# ---------------------------------------------------------------------------

data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

locals {
  # Fall back to the resource group location when var.location is not set,
  # mirroring the Bicep `param location string = resourceGroup().location`.
  resolved_location = var.location != null ? var.location : data.azurerm_resource_group.rg.location
}

# ---------------------------------------------------------------------------
# Monitoring
# ---------------------------------------------------------------------------

resource "azurerm_log_analytics_workspace" "log" {
  name                = var.log_analytics_workspace_name
  location            = local.resolved_location
  resource_group_name = data.azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appinsights" {
  name                = var.app_insights_name
  location            = local.resolved_location
  resource_group_name = data.azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.log.id
  application_type    = "web"
}

# ---------------------------------------------------------------------------
# Storage account – Dapr state store backend
# ---------------------------------------------------------------------------

resource "azurerm_storage_account" "storage" {
  name                     = var.storage_account_name
  resource_group_name      = data.azurerm_resource_group.rg.name
  location                 = local.resolved_location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
}

resource "azurerm_storage_container" "albums" {
  name                  = var.blob_container_name
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

# ---------------------------------------------------------------------------
# Container Apps Environment
# ---------------------------------------------------------------------------

resource "azurerm_container_app_environment" "env" {
  name                = var.container_apps_env_name
  location            = local.resolved_location
  resource_group_name = data.azurerm_resource_group.rg.name

  log_analytics_workspace_id                  = azurerm_log_analytics_workspace.log.id
  dapr_application_insights_connection_string = azurerm_application_insights.appinsights.connection_string
}

# ---------------------------------------------------------------------------
# Dapr state-store component (mirrors dapr-statestore.bicep)
# ---------------------------------------------------------------------------

resource "azurerm_container_app_environment_dapr_component" "statestore" {
  name                         = "statestore"
  container_app_environment_id = azurerm_container_app_environment.env.id
  component_type               = "state.azure.blobstorage"
  version                      = "v1"
  ignore_errors                = false
  init_timeout                 = "5s"

  secret {
    name  = "storageaccountkey"
    value = azurerm_storage_account.storage.primary_access_key
  }

  metadata {
    name  = "accountName"
    value = azurerm_storage_account.storage.name
  }

  metadata {
    name  = "containerName"
    value = azurerm_storage_container.albums.name
  }

  metadata {
    name        = "accountKey"
    secret_name = "storageaccountkey"
  }

  # Limit state-store access to the API service only
  scopes = ["album-api"]
}

# ---------------------------------------------------------------------------
# album-api Container App  (backend, .NET 8, port 80)
# ---------------------------------------------------------------------------

resource "azurerm_container_app" "album_api" {
  name                         = "album-api"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "registrypassword"
    value = var.registry_password
  }

  registry {
    server               = var.registry_server
    username             = var.registry_username
    password_secret_name = "registrypassword"
  }

  ingress {
    target_port      = 80
    external_enabled = true

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  dapr {
    app_id       = "album-api"
    app_port     = 80
    app_protocol = "http"
  }

  template {
    container {
      name   = "album-api"
      image  = var.api_image
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }
}

# ---------------------------------------------------------------------------
# album-viewer Container App  (frontend, Vue.js 3, port 3000)
# ---------------------------------------------------------------------------

resource "azurerm_container_app" "album_viewer" {
  name                         = "album-viewer"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.rg.name
  revision_mode                = "Single"

  # Wait for the API to be available before deploying the viewer
  depends_on = [azurerm_container_app.album_api]

  secret {
    name  = "registrypassword"
    value = var.registry_password
  }

  registry {
    server               = var.registry_server
    username             = var.registry_username
    password_secret_name = "registrypassword"
  }

  ingress {
    target_port      = 3000
    external_enabled = true

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  dapr {
    app_id       = "album-viewer"
    app_port     = 3000
    app_protocol = "http"
  }

  template {
    container {
      name   = "album-viewer"
      image  = var.viewer_image
      cpu    = 0.25
      memory = "0.5Gi"
    }
  }
}
