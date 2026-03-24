# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Log Analytics Workspace (used by the Container Apps Environment for monitoring)
resource "azurerm_log_analytics_workspace" "log" {
  name                = var.log_analytics_workspace_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Azure Container Apps Environment
resource "azurerm_container_app_environment" "env" {
  name                       = var.container_apps_env_name
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.log.id
}

# album-api Container App (.NET 8, port 80)
resource "azurerm_container_app" "album_api" {
  name                         = "album-api"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = "${var.registry_name}.azurecr.io"
    username             = var.registry_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = var.registry_password
  }

  template {
    container {
      name   = "album-api"
      image  = var.api_image
      cpu    = 0.5
      memory = "1Gi"
    }
  }

  ingress {
    external_enabled = true
    target_port      = 80

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# album-viewer Container App (Vue.js/Vite frontend, port 3000)
resource "azurerm_container_app" "album_viewer" {
  name                         = "album-viewer"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = "${var.registry_name}.azurecr.io"
    username             = var.registry_username
    password_secret_name = "registry-password"
  }

  secret {
    name  = "registry-password"
    value = var.registry_password
  }

  template {
    container {
      name   = "album-viewer"
      image  = var.viewer_image
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "VITE_ALBUM_API_HOST"
        value = var.vite_album_api_host != "" ? var.vite_album_api_host : "https://${one(azurerm_container_app.album_api.ingress).fqdn}"
      }

      env {
        name  = "VITE_BACKGROUND_COLOR"
        value = var.vite_background_color
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  depends_on = [azurerm_container_app.album_api]
}

# Outputs
output "album_api_fqdn" {
  description = "Fully qualified domain name of the album-api Container App"
  value       = "https://${one(azurerm_container_app.album_api.ingress).fqdn}"
}

output "album_viewer_fqdn" {
  description = "Fully qualified domain name of the album-viewer Container App"
  value       = "https://${one(azurerm_container_app.album_viewer.ingress).fqdn}"
}
