export interface IConfigurationCallback {
  isAnyFieldModified(): boolean;
  isRestartRequired(): boolean;
  cleanMetadata(): void;
}
