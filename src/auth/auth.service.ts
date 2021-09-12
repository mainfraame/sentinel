import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {jwtConstants} from './constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const {password, ...user} = await this.usersService.findOne(username);

        if (password !== pass) {
            throw new UnauthorizedException();
        }

        return user;
    }

    async login(user: any) {
        return this.jwtService.sign(
            {
                username: user.username,
                sub: user.userId
            },
            {
                expiresIn: jwtConstants.expiration
            }
        );
    }
}
