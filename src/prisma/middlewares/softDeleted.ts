import { Prisma } from '@prisma/client';

// const table = ['prefix', 'level', 'user', 'theme', 'user_logger'];
const table = ['users', 'expense'];

export function SoftDeleted<
  T extends Prisma.BatchPayload = Prisma.BatchPayload,
>(): Prisma.Middleware {
  return async (
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<T>,
  ): Promise<T> => {
    let filter = table.filter((item) => item === params.model);
    if (filter.length !== 0) {
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.action = 'findFirst';
        params.args.where['deleted'] = false;
      }
      if (params.action === 'findMany') {
        if (params.args.where) {
          if (params.args.where.deleted == undefined) {
            params.args.where['deleted'] = false;
          }
        } else {
          params.args['where'] = { deleted: false };
        }
      }
      if (params.action == 'update') {
        params.action = 'updateMany';
        params.args.where['deleted'] = false;
      }
      if (params.action == 'updateMany') {
        if (params.args.where != undefined) {
          params.args.where['deleted'] = false;
        } else {
          params.args['where'] = { deleted: false };
        }
      }
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { deleted: true };
      }
      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deleted'] = true;
        } else {
          params.args['data'] = { deleted: true };
        }
      }
    }
    return await next(params);
  };
}
