import { JwtModule, JwtService } from '@nestjs/jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private JwtService: JwtService,
    ) { }

    async signup(signupDto: SignUpDto): Promise<{ token: string }> {
        const { name, email, password } = signupDto;

        const decryptPassword = bcrypt.hash(password, 10)
        const user = await this.userModel.create({
            name,
            email,
            password: decryptPassword
        })

        const token = this.JwtService.sign({ id: user._id })

        return { token };

    }


    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid Email or Password');
        }

        const isPasswordValid = await bcrypt.compare(password, user?.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid Password');
        }

        const token = this.JwtService.sign({ id: user._id })
        return { token };
    }
}
