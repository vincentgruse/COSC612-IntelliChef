
export interface Recipe {
  id: string
  name: string
  image: string//Base64 encoded image
  description: string
  ingredients: string[]
  instructions: string[]
  isFavorite: boolean
}
