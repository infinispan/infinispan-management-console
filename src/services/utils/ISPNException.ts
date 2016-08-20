export class ISPNException extends Error {
  public name: string = "ISPNException";
  constructor(public message?: string) {
    super(message);
  }
}
