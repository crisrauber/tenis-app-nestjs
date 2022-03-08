import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class AtualizarDesafioDto {
  @IsNotEmpty()
  readonly status: string;

  @IsOptional()
  dataHoraResposta: Date;
}
