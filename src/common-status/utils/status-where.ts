import { StatusFilter } from '../dto/status-query.dto';

export const statusWhere = (status: StatusFilter | undefined) => {
  if (status === 'active')   return { status: true };
  if (status === 'inactive') return { status: false };
  return undefined; // 'all' -> no filter
};
