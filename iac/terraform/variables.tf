# ---------------------------------------------------------------------------
# Required variables – no defaults (must be supplied by the operator)
# ---------------------------------------------------------------------------

variable "resource_group_name" {
  description = "Name of the existing Azure resource group to deploy into."
  type        = string
}

variable "registry_server" {
  description = "Container registry server hostname (e.g. myregistry.azurecr.io)."
  type        = string
}

variable "registry_username" {
  description = "Username for the container registry."
  type        = string
}

variable "registry_password" {
  description = "Password (or token) for the container registry. Mark as sensitive – never hard-code."
  type        = string
  sensitive   = true
}

variable "api_image" {
  description = "Full image reference for the album-api service (e.g. myregistry.azurecr.io/albums-api:latest)."
  type        = string
}

variable "viewer_image" {
  description = "Full image reference for the album-viewer service (e.g. myregistry.azurecr.io/album-viewer:latest)."
  type        = string
}

# ---------------------------------------------------------------------------
# Optional variables – sensible defaults provided
# ---------------------------------------------------------------------------

variable "location" {
  description = "Azure region for all resources. Defaults to the resource group's location when null."
  type        = string
  default     = null
}

variable "container_apps_env_name" {
  description = "Name of the Azure Container Apps Environment."
  type        = string
  default     = "env-albums"
}

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace."
  type        = string
  default     = "log-albums"
}

variable "app_insights_name" {
  description = "Name of the Application Insights instance."
  type        = string
  default     = "appinsights-albums"
}

variable "storage_account_name" {
  description = "Name of the storage account used for the Dapr state store. Must be 3-24 lowercase alphanumeric characters and globally unique across Azure."
  type        = string
}

variable "blob_container_name" {
  description = "Name of the blob container inside the storage account (Dapr state store)."
  type        = string
  default     = "albums"
}
