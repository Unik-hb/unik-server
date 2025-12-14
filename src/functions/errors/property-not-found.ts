export class PropertyNotFoundError extends Error {
  constructor() {
    super('Propriedade não encontrada')
    this.name = 'PropertyNotFoundError'
  }
}
