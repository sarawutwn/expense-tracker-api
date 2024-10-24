import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async GetExpenses(
    queryParams: {
      expenseId?: string;
      category?: string;
      page?: number;
      size?: number;
      startDate?: string;
      endDate?: string;
    },
    user_id: string,
  ) {
    const { expenseId, category, page, size, startDate, endDate } = queryParams;
    let where: any = {};
    where.user_id = user_id;
    if (expenseId) {
      where.expense_id = expenseId;
    }
    if (category) {
      where.expense_category = category;
    }
    if (startDate && endDate) {
      where.expense_timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    const skip = Number((page - 1) * size);
    const take = Number(size);
    const expenses = await this.prisma.expense.findMany({
      where,
      skip,
      take,
    });
    const totalCount = await this.prisma.expense.count({ where });
    return {
      statusCode: 200,
      message: 'success',
      results: {
        data: expenses,
        totalItems: totalCount,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCount / size),
      },
    };
  }

  async NewExpense(createExpenseDto: CreateExpenseDto, user_id: string) {
    const results = await this.prisma.expense.create({
      data: {
        expense_title: createExpenseDto.expense_title,
        expense_amount: createExpenseDto.expense_amount,
        expense_timestamp: new Date(),
        expense_category: String(createExpenseDto.expense_category),
        expense_note: createExpenseDto.expense_note,
        user_id,
      },
    });
    return {
      statusCode: 201,
      message: 'Create expense successfully.',
      results,
    };
  }

  async UpdateExpense(
    updateExpenseDto: CreateExpenseDto,
    user_id: string,
    expense_id: string,
  ) {
    const oldExpense = await this.prisma.expense.findUnique({
      where: { expense_id },
      select: { expense_id: true, user_id: true },
    });
    if (!oldExpense) throw new NotFoundException('Not found this expense_id!');
    if (oldExpense.user_id !== user_id)
      throw new BadRequestException('You cannot update this expense_id!');
    await this.prisma.expense.update({
      where: {
        expense_id,
      },
      data: {
        expense_title: updateExpenseDto.expense_title,
        expense_amount: updateExpenseDto.expense_amount,
        expense_category: String(updateExpenseDto.expense_category),
        expense_note: updateExpenseDto.expense_note,
      },
    });
    return { statusCode: 200, message: 'Update expense successfully.' };
  }

  async DeleteExpense(expense_id: string, user_id: string) {
    const oldExpense = await this.prisma.expense.findUnique({
      where: { expense_id },
      select: {
        expense_id: true,
        user_id: true,
      },
    });
    if (!oldExpense) throw new NotFoundException('Not found this expense_id!');
    if (oldExpense.user_id !== user_id)
      throw new BadRequestException('You cannot delete this expense_id!');
    await this.prisma.expense.delete({
      where: {
        expense_id,
      },
    });
    return { statusCode: 200, message: 'Delete expense successfully.' };
  }
}
