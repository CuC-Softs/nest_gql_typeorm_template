import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { GqlAuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), GqlAuthGuard],
  providers: [UserService, UserResolver],
})
export class UserModule {}
