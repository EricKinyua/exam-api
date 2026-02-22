import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  Req,
  HttpStatus,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Response } from 'express';
import { CreateAssignmentDto } from './dto/create-exam.dto';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtUser } from '../auth/strategies/jwt.strategy';
//import { UpdateExamDto } from './dto/update-exam.dto';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER')
  @HttpCode(201)
  async createAssignment(
    @Res() res: Response,
    @Req() req: { user: JwtUser },
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    const teacherId = req.user.id;
    const assignment = await this.examsService.createAssignment(
      teacherId,
      createAssignmentDto,
    );

    return res.status(HttpStatus.CREATED).json({
      status: true,
      message: 'Assignment created successfully',
      assignment,
    });
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Fetches all assignments' })
  async getAllAssignments(@Res() res: Response) {
    const assignments = await this.examsService.getAllAssignments();

    return res.status(HttpStatus.OK).json({
      status: true,
      message: 'Assignments fetched successfully',
      assignments,
    });
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Fetches a single assignment' })
  async getAssignment(@Res() res: Response, @Param('id') id: string) {
    const assignment = await this.examsService.getAssignment(id);

    return res.status(HttpStatus.OK).json({
      status: true,
      message: 'Assignment fetched successfully',
      assignment,
    });
  }

  // @Get()
  // findAll() {
  //   return this.examsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.examsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
  //   return this.examsService.update(+id, updateExamDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.examsService.remove(+id);
  // }
}
