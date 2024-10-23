import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export enum Category {
  FOOD,
  TRANSPORTATION,
}

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  expense_title: string;

  @IsNotEmpty()
  @IsNumber()
  expense_amount: number;

  @IsNotEmpty({ message: 'expense_category should not be empty' })
  @IsEnum(Category, { message: 'Category must be either FOOD or TRANSPORTATION' })
  expense_category: Category;

  expense_note: string;
}
