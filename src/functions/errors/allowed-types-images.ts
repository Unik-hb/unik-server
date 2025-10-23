export class AllowedTypesImagesError extends Error {
  constructor() {
    super('Tipo de arquivo inválido. Use jpg, jpeg ou png.')
  }
}
