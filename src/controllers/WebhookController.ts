import { Request, Response } from 'express'
import Controller from "./Controller";

class WebhookController extends Controller {

  public notification () {

    if (this.req.query.validationToken) {

      this.res.status(200)
      this.res.contentType('text/plain')

      return this.res.send(this.req.query.validationToken)

    }

    this.res.status(200)

    console.log(this.req.body)

    return this.res.end()

  }

}

export default WebhookController