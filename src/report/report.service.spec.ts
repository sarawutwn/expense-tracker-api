import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReportService', () => {
  let service: ReportService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: PrismaService,
          useValue: {
            expense: {
              findMany: jest.fn().mockResolvedValue([
                { expense_category: 'FOOD', expense_amount: 100 },
                { expense_category: 'TRANSPORTATION', expense_amount: 50 },
                { expense_category: 'FOOD', expense_amount: 50 },
              ]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct report data', async () => {
    const result = await service.getReport('userId', '2024-01-01', '2024-01-31');
    expect(prismaService.expense.findMany).toHaveBeenCalledWith({
      where: {
        user_id: 'userId',
        expense_timestamp: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-01-31'),
        },
      },
      select: {
        expense_category: true,
        expense_amount: true,
      },
    });

    expect(result).toEqual({
      statusCode: 200,
      message: 'success',
      results: [
        { category: 'FOOD', transaction: 2, amount: 150 },
        { category: 'TRANSPORTATION', transaction: 1, amount: 50 },
      ],
    });
  });

  it('should handle empty expense list', async () => {
    prismaService.expense.findMany = jest.fn().mockResolvedValue([]);
    const result = await service.getReport('userId', '2024-01-01', '2024-01-31');
    expect(result).toEqual({
      statusCode: 200,
      message: 'success',
      results: [],
    });
  });
});
