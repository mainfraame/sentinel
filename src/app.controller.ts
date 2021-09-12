import {Controller, Get, Post, UseGuards, Res, Req} from '@nestjs/common';
import {FastifyRequest} from 'fastify';
import {AuthService} from './auth/auth.service';
import {JwtAuthGuard} from './auth/guards/jwt-auth.guard';
import {jwtConstants} from './auth/constants';

@Controller()
export class AppController {
    constructor(private readonly authService: AuthService) {}

    @Post('auth/login')
    async login(@Req() req: FastifyRequest, @Res() res) {
        const token = await this.authService.login(req.body);

        res.setCookie('token', token, {
            expires: new Date(new Date().getTime() + jwtConstants.expiration)
        });

        return res.json(token);
    }

    @UseGuards(JwtAuthGuard)
    @Get('auth/logout')
    async logout(@Res() res) {
        res.setCookie('token', '', {
            expires: new Date()
        });

        return res.json({});
    }

    @UseGuards(JwtAuthGuard)
    @Get('auth/profile')
    getProfile(@Req() req: FastifyRequest & {user: any}) {
        return req.user;
    }
}
