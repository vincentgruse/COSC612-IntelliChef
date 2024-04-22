
export interface Recipe {
  id: number
  name: string
  image: string//Base64 encoded image
  description: string
  ingredients: any[]
  instructions: string
  favourite: boolean
}
