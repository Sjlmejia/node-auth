
import { Validators } from '../../../config';
export class LoginUserDto {

  constructor(
    public email: string,
    public password: string
  ) { }


  static create(object:{[key: string]: any}): [string?, LoginUserDto?] {
    const { email, password } = object;
    if( !email ) return ['email is required'];
    if( !Validators.email.test(email) ) return ['email is not valid'];
    if( !password ) return ['password is required'];
    if( password.length < 8 ) return ['password must be at least 8 characters'];
    return [
      undefined,
      new LoginUserDto( email, password)
    ];
  }
}