import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { Msg91Service } from 'src/msg91';
import { UsersService } from '../users/users.service';
import {
  AuthRequestDto,
  ResendOtpRequestDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
  ProfileResponseDto,
} from './auth.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly msg91Service: Msg91Service,
    private readonly usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  // 🔒 Admin login (DB-based)
  async validateAdmin(email: string, pass: string): Promise<any> {
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail || !pass) return null;

    const admin = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
        status: true,
        email: trimmedEmail,
      },
    });
console.log(admin);
    if (!admin || !admin.password) return null;

    const ok = await bcrypt.compare(pass, admin.password);
    if (!ok) return null;

    return { id: admin.id, email: admin.email, role: admin.role };
  }

  // ✅ Include id in JWT so req.user.id is available later
  async loginAdmin(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }),
    };
  }

  // 🔁 Change Admin Password by logged-in user id
  async changeAdminPassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    // Guard against missing/invalid id in JWT
    if (!Number.isFinite(userId)) {
      throw new UnauthorizedException(
        'Invalid token: user id missing. Please log out and log in again.',
      );
    }

    // 1) Fetch user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    console.log(user);
    if (!user) throw new NotFoundException('User not found');

    // 2) Ensure admin
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can change this password');
    }

    // 3) Ensure password exists
    if (!user.password) {
      throw new BadRequestException('No password set for this account.');
    }

    // 4) Validate old password
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) throw new BadRequestException('Old password is incorrect');

    // 5) Prevent reuse
    const reuse = await bcrypt.compare(newPassword, user.password);
    if (reuse) {
      throw new BadRequestException(
        'New password must be different from old password',
      );
    }

    // 6) Hash and update
    const hash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hash },
    });

    return { message: 'Password changed successfully' };
  }

  // 🔐 Send OTP
  async authenticate(authRequestDto: AuthRequestDto) {
    try {
      const { mobileNumber } = authRequestDto;
      const isTestAccount =
        mobileNumber === process.env.TEST_ACCOUNT_MOBILE &&
        process.env.ENABLE_TEST_ACCOUNT === 'true';

      if (!isTestAccount) {
        // await this.msg91Service.sendOtp(mobileNumber);
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Failed to authenticate user: ' + error.message,
      );
    }
  }

  async resendOtp(resendOtpRequestDto: ResendOtpRequestDto) {
    // await this.msg91Service.sendOtp(resendOtpRequestDto.mobileNumber);
  }

  // 🔐 Verify OTP & login or create user
  async verifyOtp(
    verifyOtpRequestDto: VerifyOtpRequestDto,
  ): Promise<VerifyOtpResponseDto> {
    try {
      const { mobileNumber, otp } = verifyOtpRequestDto;

      const isTestAccount =
        mobileNumber === process.env.TEST_ACCOUNT_MOBILE &&
        process.env.ENABLE_TEST_ACCOUNT === 'true';

      if (!isTestAccount) {
        // await this.msg91Service.verifyOtp(mobileNumber, otp);
      }

      let user = await this.usersService.findByMobileNumber(mobileNumber);

      if (!user) {
        user = await this.usersService.create(mobileNumber, 'CUSTOMER');
      }

      const access_token = this.jwtService.sign(
        { id: user.id },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
      );

      await this.usersService.updateUser(user.id, { token: access_token });

      return { access_token };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to verify user');
    }
  }

  // 🔍 Profile
  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new UnauthorizedException('Unauthorized');

    return plainToInstance(ProfileResponseDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  // 🚪 Logout
  async logout(userId: number) {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new UnauthorizedException('Unauthorized');
    await this.usersService.updateUser(userId, { token: null });
  }
}
