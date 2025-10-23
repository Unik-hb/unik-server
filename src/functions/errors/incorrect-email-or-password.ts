export class IncorrectEmailOrPasswordError extends Error {
  constructor() {
    super('E-mail e/ou senha incorretos!')
  }
}
