output "container_apps_env_name" {
  description = "Name of the Azure Container Apps Environment."
  value       = azurerm_container_app_environment.env.name
}

output "album_api_fqdn" {
  description = "Fully-qualified domain name of the album-api Container App."
  value       = azurerm_container_app.album_api.latest_revision_fqdn
}

output "album_viewer_fqdn" {
  description = "Fully-qualified domain name of the album-viewer Container App."
  value       = azurerm_container_app.album_viewer.latest_revision_fqdn
}

output "storage_account_name" {
  description = "Name of the storage account backing the Dapr state store."
  value       = azurerm_storage_account.storage.name
}

output "log_analytics_workspace_id" {
  description = "Resource ID of the Log Analytics Workspace."
  value       = azurerm_log_analytics_workspace.log.id
}
