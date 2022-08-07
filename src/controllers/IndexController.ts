import Controller from './Controller'
import { PrismaClient } from '@prisma/client';

export default class IndexController extends Controller {

  db: PrismaClient

  constructor(db: PrismaClient) {
      super();
      this.db = db
  }

  public async index() {

      const response = await this.db.receipt.findMany(
          {
            include: {
              vendor: true,
              items: true
            }
          }
      )

      const results = Array.from(response)

      this.res.render('app/index', { results: JSON.stringify(results) })

  }

}