variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
}

variable "location" {
  description = "Azure region where resources will be deployed"
  type        = string
  default     = "eastus"
}

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics Workspace"
  type        = string
}

variable "container_apps_env_name" {
  description = "Name of the Azure Container Apps Environment"
  type        = string
}

variable "registry_name" {
  description = "Name of the Azure Container Registry (without .azurecr.io)"
  type        = string
}

variable "registry_username" {
  description = "Username for Azure Container Registry authentication"
  type        = string
}

variable "registry_password" {
  description = "Password for Azure Container Registry authentication"
  type        = string
  sensitive   = true
}

variable "api_image" {
  description = "Full image reference for the album-api container (e.g. myregistry.azurecr.io/album-api:latest)"
  type        = string
}

variable "viewer_image" {
  description = "Full image reference for the album-viewer container (e.g. myregistry.azurecr.io/album-viewer:latest)"
  type        = string
}

variable "vite_album_api_host" {
  description = "URL of the album-api service used by the frontend (VITE_ALBUM_API_HOST)"
  type        = string
  default     = ""
}

variable "vite_background_color" {
  description = "Background color for the album-viewer frontend (VITE_BACKGROUND_COLOR)"
  type        = string
  default     = "#ffffff"
}
