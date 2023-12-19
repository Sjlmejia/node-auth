
import express, { Router } from 'express';

interface Options {
  port?:number;
  routes:Router;
}

export class Server {

  public readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor( options: Options) {
    const { port = 3100 } = options;

    this.port = port;
    this.routes = options.routes;
  }

  async start() {

    //middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended:true}));//x-www-form-urlencoded
    //use routes
    this.app.use(this.routes);

    //listen port
    this.app.listen(this.port,()=>{
      console.log(`Server running on port ${this.port}`)
    })
  }
}