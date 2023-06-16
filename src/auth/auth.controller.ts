import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signUp(@Body() signup: SignUpDto): Promise<{ token: string }> {
        return this.authService.signup(signup);
    }

    @Post('login')
    login(@Body() login: LoginDto): Promise<{ token: string }> {
        return this.authService.login(login);
    }
}