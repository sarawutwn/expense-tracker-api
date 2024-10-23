import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getReport(user_id: string, startDate: string, endDate: string) {
    let where: any = {};
    where.user_id = user_id;
    if (startDate && endDate) {
      where.expense_timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    let expenseList = await this.prisma.expense.findMany({
      where,
      select: {
        expense_category: true,
        expense_amount: true,
      },
    });

    const results = expenseList.reduce((acc, expense) => {
      const category = expense.expense_category;
      if (!acc[category]) {
        acc[category] = {
          category: category,
          transaction: 0,
          amount: 0,
        };
      }
      acc[category].transaction += 1;
      acc[category].amount += Number(expense.expense_amount);
      return acc;
    }, {});
    return { statusCode: 200, message: 'success', results };
  }
}
