export class ProviderNotConfiguredError extends Error {
  constructor() {
    super("Anime provider is not configured.");
    this.name = "ProviderNotConfiguredError";
  }
}
