export class ValidationError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the Error constructor
    this.name = 'ValidationError'; // Set the name of the error to the class name
    Object.setPrototypeOf(this, ValidationError.prototype); // Ensure correct prototype chain
  }
}
