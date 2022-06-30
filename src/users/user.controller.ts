import { Controller, Get, Next, Param, Patch, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/')
  async getAllUsers(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const users = await this.userService.findAll();
    res.status(200).json({
      status: 'success',
      data: users,
    });
  }
  @Get('/:id')
  async getUser(
    @Param('id') id: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const user = await this.userService.findOne(id);
    res.status(200).json({
      status: 'success',
      data: user,
    });
  }
  @Patch('/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.userService.deleteOne(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
}
