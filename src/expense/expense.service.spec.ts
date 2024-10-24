import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseService } from './expense.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let prismaService: PrismaService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: PrismaService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
