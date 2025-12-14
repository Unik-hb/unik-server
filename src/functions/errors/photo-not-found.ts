export class PhotoNotFoundError extends Error {
  constructor() {
    super('Foto não encontrada na propriedade')
    this.name = 'PhotoNotFoundError'
  }
}
