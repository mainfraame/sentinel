import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import type {Request} from 'express';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {jwtConstants} from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req.cookies?.token ?? null;
                },
                ExtractJwt.fromAuthHeaderAsBearerToken()
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }

    async validate(payload: any) {
        return {
            userId: payload.sub,
            username: payload.username
        };
    }
}
