export interface CreateUserDto {
  email: string
  name?: string
}

export interface UserDto {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}