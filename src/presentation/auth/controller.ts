import { Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUser, RegisterUserDto } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';
import { LoginUser } from '../../domain/use-cases/auth/login-user.use-case';

export class AuthController {

  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  private handleError(error: unknown, res: Response) {
    if(error instanceof CustomError) {
    
      return res.status(error.statusCode).json({error: error.message});
    }
    return res.status(500).json({error: 'Internal server error'});

  }

  registerUser = async (req:Request, res:Response)=> {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if(error) return res.status(400).json({error});
    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
    
  }

  loginUser = ( req:Request, res:Response)=> {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if(error) return res.status(400).json({error});
    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then(data => res.json(data))
      .catch(error => this.handleError(error, res));
  }

  getUsers = ( req:Request, res:Response)=> {
    
    UserModel.find()
      .then(users => {
        res.json({
          //users,
          user: req.body.user
        })
      })
      .catch(error => res.status(500).json({error: 'Internal server error'}));
  }
}
