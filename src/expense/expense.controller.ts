import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { Request } from 'express';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/')
  getExpenseList(
    @Req() req: Request,
    @Query('expense_id') expenseId?: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expenseService.GetExpenses(
      {
        expenseId,
        page,
        size,
        startDate,
        endDate,
      },
      req.user['sub'],
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('/')
  createNewExpense(@Req() req: Request, @Body() body: CreateExpenseDto) {
    return this.expenseService.NewExpense(body, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  updateExpense(
    @Req() req: Request,
    @Body() body: CreateExpenseDto,
    @Param('id') id: string,
  ) {
    return this.expenseService.UpdateExpense(body, req.user['sub'], id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  DeleteExpense(@Req() req: Request, @Param('id') id: string) {
    return this.expenseService.DeleteExpense(id, req.user['sub']);
  }
}
