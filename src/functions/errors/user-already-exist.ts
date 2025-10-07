export class UserAlreadyExistError extends Error {
  constructor() {
    super('E-mail já está em uso, tente outro.')
  }
}
