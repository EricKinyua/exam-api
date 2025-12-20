import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateChoiceDto {
  @ApiProperty()  
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({type: [CreateChoiceDto]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChoiceDto)
  choices: CreateChoiceDto[];
}

export class CreateAssignmentDto {
@ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty({type: [CreateQuestionDto]})
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

// src/assignments/dto/submit-assignment.dto.ts
export class AnswerDto {
  @ApiProperty()  
  @IsString()
  questionId: string;

  @ApiProperty()
  @IsString()
  choiceId: string;
}
