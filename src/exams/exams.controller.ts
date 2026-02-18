import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { Response } from 'express';
import { CreateAssignmentDto } from './dto/create-exam.dto';
import { ApiOperation } from '@nestjs/swagger';
//import { UpdateExamDto } from './dto/update-exam.dto';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @HttpCode(201)
  async createAssignment(
    @Res() res: Response,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    // TODO: replace with authenticated user id when JWT is implemented
    const teacherId = '8e3af025-2802-4000-bcb7-419a79a76db6';
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
