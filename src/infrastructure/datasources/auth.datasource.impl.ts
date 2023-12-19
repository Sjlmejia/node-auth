import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hash: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare
  ) {

  }
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
   
    const {email, password} = loginUserDto;
    try {
      const user = await UserModel.findOne({email});
      if(!user) throw CustomError.badRequest('User not exists');

      const isMatching = this.comparePassword(password, user.password);
      if(!isMatching) throw CustomError.badRequest('Password is not valid');
      return UserMapper.userEntityFromObject(user);
    }catch(error) {
      throw CustomError.internal();
    }
  }
  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const {name, email, password} = registerUserDto;
    
    try {

      const exists = await UserModel.findOne({email});

      if(exists) throw CustomError.badRequest('User already exists');
      
      const user = await UserModel.create({
        name,
        email,
        password: this.hashPassword(password),
      });

      await user.save();
      return UserMapper.userEntityFromObject(user)
    } catch (error) {
      if(error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internal();
    }
  }

}