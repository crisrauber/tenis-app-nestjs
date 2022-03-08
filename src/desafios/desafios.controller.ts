import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafiosService } from './desafios.service';
import { atribuirDesafioPartida } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio-dto';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-pipe';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async consultarTodosDesafios(
    @Query('idJogador') idJogador: string,
  ): Promise<Desafio[]> {
    if (idJogador) {
      return await this.desafiosService.consultarDesafiosDoJogador(idJogador);
    }
    return await this.desafiosService.consultarTodosDesafios();
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body(DesafioStatusValidacaoPipe) atualizarDesafio: AtualizarDesafioDto,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(id, atualizarDesafio);
  }

  @Put('/:id/partida/')
  @UsePipes(ValidationPipe)
  async atribuirPartidaDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atribuirDesafioPartida: atribuirDesafioPartida,
  ): Promise<void> {
    await this.desafiosService.atribuirDesafioPartida(
      id,
      atribuirDesafioPartida,
    );
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  async cancelarDesafio(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.desafiosService.cancelarDesafio(id);
  }
}
