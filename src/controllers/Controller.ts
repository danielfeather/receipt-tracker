import { Request, Response } from 'express'

export default abstract class Controller {

  public req!: Request
  public res!: Response

  public setup(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

}