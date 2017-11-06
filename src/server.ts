import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import {Application, NextFunction, Router} from 'express'
// import * as morgan from "morgan";
import * as methodOverride from 'method-override'
import {Sequelize} from 'sequelize-typescript'
import {routeList} from './annotations/controller'
import autoImport from './utils/auto-import'
// import errorHandler = require("errorhandler");
import cookieParser = require('cookie-parser')


export class Server {
  
  public app: Application
  
  constructor() {
    //create expressjs application
    this.app = express()
    
    //configure application
    this.config()
    
    //add routes
    this.routes()
    
    //add api
    this.api()
  }
  
  public static bootstrap(): Server {
    return new Server()
  }
  
  private api() {
    //empty for now
  }
  
  private async config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, 'public')))
    
    this.app.set('view engine', 'json')
    
    //use logger middlware
    // this.app.use(morgan('dev'));
    
    //use response form parser middlware
    this.app.use(bodyParser.json())
    
    //use query string parser middlware
    this.app.use(bodyParser.urlencoded({
                                         extended: true
                                       }))
    
    //use cookie parser middleware
    this.app.use(cookieParser('SECRET_GOES_HERE'))
    
    //use override middlware
    this.app.use(methodOverride())
    
    //catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: NextFunction) {
      err.status = 404
      next(err)
    })
    
    //error handling
    // this.app.use(errorHandler());
    
    const sequelize = new Sequelize({
                                      host: '192.168.0.251',
                                      database: 'ts_init',
                                      dialect: 'postgres',
                                      username: 'postgres',
                                      password: 'qf4E\\+E-',
                                      modelPaths: [path.join(__dirname, 'models')]
                                    })
    
    await autoImport(
      path.join(__dirname, 'services', 'impl'),
      it => !it.includes('.map') && it.includes('.js')
    )
  }
  
  private async routes() {
    await autoImport(
      path.join(__dirname, 'controllers'),
      it => !it.includes('.map') && it.includes('.js')
    )
    const router = Router()
    routeList.forEach(it => it.create(router))
    this.app.use(router)
  }
}
