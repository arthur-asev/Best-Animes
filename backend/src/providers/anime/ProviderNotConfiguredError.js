export class ProviderNotConfiguredError extends Error {
  constructor() {
    super("Anime provider is not configured while the Consumet license review is pending.");
    this.name = "ProviderNotConfiguredError";
  }
}
