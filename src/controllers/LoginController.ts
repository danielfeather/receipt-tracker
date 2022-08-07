import Controller from './Controller'
import { PrismaClient } from '@prisma/client';


export default class LoginController extends Controller {

  db: PrismaClient

  constructor(db: PrismaClient) {
    super();
    this.db = db
  }

  public async login() {



  }

}