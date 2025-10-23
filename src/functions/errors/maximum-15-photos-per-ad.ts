export class Maximum15PhotosPerAdError extends Error {
  constructor() {
    super('O anúncio pode ter no máximo 15 fotos.')
  }
}
