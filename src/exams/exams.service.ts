import { Inject, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-exam.dto';
import { PrismaService } from 'src/prisma/prisma.service';
//import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @Inject(PrismaService) private readonly _prismaService: PrismaService,
  ) {}
  async createAssignment(
    teacherId: string,
    createAssignmentDto: CreateAssignmentDto,
  ) {
    try {
      for (const question of createAssignmentDto.questions) {
        const hasCorrectAnswer = question.choices.some(
          (choice) => choice.isCorrect,
        );
        if (!hasCorrectAnswer) {
          throw `Question "${question.text}" must have at least one correct answer`;
        }
      }
      const assignment = await this._prismaService.assignment.create({
        data: {
          title: createAssignmentDto.title,
          description: createAssignmentDto.description,
          teacherId,
          questions: {
            create: createAssignmentDto.questions.map((q) => ({
              text: q.text,
              order: q.order,
              choices: {
                create: q.choices.map((c) => ({
                  text: c.text,
                  isCorrect: c.isCorrect,
                  order: c.order,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: {
              choices: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      return assignment;
    } catch (error) {
      throw error;
    }
  }

  async getAllAssignments() {
    try {
      const assignments = await this._prismaService.assignment.findMany({
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              questions: true,
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async getAssignment(assignmentId: string) {
    try {
      const assignment = await this._prismaService.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          questions: {
            include: {
              choices: {
                select: {
                  id: true,
                  text: true,
                  order: true,
                },
                orderBy: {
                  order: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      return assignment;
    } catch (error) {
      throw error;
    }
  }

  // findAll() {
  //   return `This action returns all assignments`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} assignment`;
  // }

  // update(id: number, updateExamDto: UpdateExamDto) {
  //   return `This action updates a #${id} assignment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} assignment`;
  // }
}
