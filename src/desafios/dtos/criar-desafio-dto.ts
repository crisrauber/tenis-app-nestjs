import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CriarDesafioDto {
  @IsNotEmpty()
  readonly solicitante: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dataHoraDesafio: Date;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  readonly jogadores: Array<string>;
}
