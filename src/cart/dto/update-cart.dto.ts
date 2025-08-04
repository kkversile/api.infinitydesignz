import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  cartId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
