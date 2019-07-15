import { BaseController } from '../core/controller/base'
import {
  DeleteMapping,
  GetMapping,
  PathVariable,
  PostMapping,
  PutMapping,
  RequestBody,
  RequestParam,
  RestController
} from '../core/annotations/controller'
import { Autowired } from '../core/annotations/di'
import UserDto, { UserCreateDto, UserUpdateDto } from '../dtos/user'
import Injectables from '../enums/injectables'
import Paths from '../enums/paths'
import { UserService } from '../services'

@RestController
export default class UserController extends BaseController {

  private userService: UserService

  @Autowired(Injectables.services.user)
  setUserService(service: UserService) {
    this.userService = service
  }

  /**
   * @swagger
   * /users/doApiRequest:
   *   get:
   *     description: Gets list of users
   *     tags:
   *       - user
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *               name:
   *                 type: string
   *           example:
   *             [
   *               {
   *                 "id": "5613263a-e644-4ae1-ae49-479ec4d0a8f7",
   *                 "name": "John Doe"
   *               },
   *               {
   *                 "id": "66da777d-38d0-45f0-89a5-06b41f2613b8",
   *                 "name": "Jane Doe"
   *               },
   *             ]
   */
  @GetMapping(Paths.user.apiRequest)
  async getAllUsersByApiRequest() {
    return this.userService.getAllUsersByApiRequest()
  }

  /**
   * @swagger
   * /users:
   *   post:
   *     description: Adds a new user
   *     tags:
   *       - user
   *     parameters:
   *     - in: body
   *       required: true
   *       schema:
   *         type: object
   *         properties:
   *           name:
   *             type: string
   *         example:
   *           name: John Doe
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             name:
   *               type: string
   *           example:
   *             {
   *               "id": "5613263a-e644-4ae1-ae49-479ec4d0a8f7",
   *               "name": "John Doe"
   *             }
   *       500:
   *         description: Validation failed
   */
  @PostMapping(Paths.user.base)
  async createUser(@RequestBody(UserCreateDto) dto: UserCreateDto): Promise<UserDto> {
    return this.userService.createUser(dto)
  }

  /**
   * @swagger
   * /users/{userId}:
   *   get:
   *     description: Gets user by id
   *     tags:
   *       - user
   *     parameters:
   *     - name: userId
   *       in: path
   *       type: string
   *       required: true
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             name:
   *               type: string
   *           example:
   *             {
   *               "id": "5613263a-e644-4ae1-ae49-479ec4d0a8f7",
   *               "name": "John Doe"
   *             }
   *       404:
   *         description: User not found
   *       500:
   *         description: Validation failed
   */
  @GetMapping(Paths.user.userId)
  async getUser(@PathVariable('userId', String) userId: string): Promise<UserDto> {
    return this.userService.getUser(userId)
  }

  /**
   * @swagger
   * /users:
   *   put:
   *     description: Updates existing user
   *     tags:
   *       - user
   *     parameters:
   *     - in: body
   *       required: true
   *       schema:
   *         type: object
   *         properties:
   *           id:
   *             type: string
   *           name:
   *             type: string
   *         example:
   *           id: "5613263a-e644-4ae1-ae49-479ec4d0a8f7"
   *           name: "John Doe"
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             name:
   *               type: string
   *           example:
   *             {
   *               "id": "5613263a-e644-4ae1-ae49-479ec4d0a8f7",
   *               "name": "John Doe"
   *             }
   *       404:
   *         description: User not found
   *       500:
   *         description: Validation failed
   */
  @PutMapping(Paths.user.base)
  async updateUser(@RequestBody(UserUpdateDto) dto: UserUpdateDto): Promise<UserDto> {
    return this.userService.updateUser(dto)
  }

  /**
   * @swagger
   * /users/{userId}:
   *   delete:
   *     description: Deletes user by id
   *     tags:
   *       - user
   *     parameters:
   *     - name: userId
   *       in: path
   *       type: string
   *       required: true
   *     responses:
   *       200:
   *         description: OK
   */
  @DeleteMapping(Paths.user.userId)
  async deleteUser(@PathVariable('userId', String) userId: string): Promise<void> {
    return this.userService.deleteUser(userId)
  }

  /**
   * @swagger
   * /users:
   *   get:
   *     description: Gets list of users
   *     tags:
   *       - user
   *     responses:
   *       200:
   *         description: OK
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               id:
   *                 type: string
   *               name:
   *                 type: string
   *           example:
   *             [
   *               {
   *                 "id": "5613263a-e644-4ae1-ae49-479ec4d0a8f7",
   *                 "name": "John Doe"
   *               },
   *               {
   *                 "id": "66da777d-38d0-45f0-89a5-06b41f2613b8",
   *                 "name": "Jane Doe"
   *               },
   *             ]
   */
  @GetMapping(Paths.user.base)
  async getAllUsers() {
    return this.userService.getAllUsers()
  }

  /**
   * @swagger
   * /users/doSendMessage?message={message}:
   *   post:
   *     description: Send messages via rabbitMQ
   *     tags:
   *       - user
   *     parameters:
   *     - in: query
   *       required: true
   *       name: message
   *       schema:
   *         type: string
   *         example: Some message
   *     responses:
   *       200:
   *         description: OK
   */
  @PostMapping(Paths.user.sendMessage)
  async sendMessage(@RequestParam('message', String) message?: string): Promise<void> {
    this.userService.sendAmqpMessage(message || 'test message')
  }

}
