import { Put, ValidationPipe } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  UsePipes,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    return await this.jogadoresService.criarJogador(criarJogadorDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() criarJogadorDto: AtualizarJogadorDto,
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(criarJogadorDto, id);
  }

  @Get()
  async consultarJogadores(): Promise<Jogador[]> {
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:id')
  async consultarJogadorPeloId(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<Jogador> {
    return await this.jogadoresService.consultarJogadoresPeloId(id);
  }

  @Delete('/:id')
  async deletarJogadores(
    @Param('id', ValidacaoParametrosPipe) id: string,
  ): Promise<void> {
    return this.jogadoresService.deletarJogador(id);
  }
}
