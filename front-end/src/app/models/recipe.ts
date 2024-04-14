
export interface Recipe {
  id: number
  name: string
  image: string//Base64 encoded image
  description: string
  ingredients: string[]
  instructions: string
  favourite: boolean
}
