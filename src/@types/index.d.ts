declare namespace Express {
  export interface Request {
    userData: {
      id: string
      name: string
      username: string
    }
  }
}
