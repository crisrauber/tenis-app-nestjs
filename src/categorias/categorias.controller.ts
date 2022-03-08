import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    return await this.categoriaService.criarCategoria(criarCategoriaDto);
  }

  @Get()
  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaService.consultarCategorias();
  }

  @Get('/:id')
  async consultarCategoriaPeloId(@Param('id') id: string): Promise<Categoria> {
    return await this.categoriaService.consultarCategoriaPeloId(id);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Param('id', ValidacaoParametrosPipe) id: string,
    @Body() atualizarCategoria: AtualizarCategoriaDto,
  ): Promise<void> {
    await this.categoriaService.atualizarCategoria(id, atualizarCategoria);
  }

  @Post('/:id/jogadores/:idJogador')
  async atribuirJogadorACategoria(@Param() params: string[]): Promise<void> {
    await this.categoriaService.atribuirJogadorACategoria(params);
  }
}
