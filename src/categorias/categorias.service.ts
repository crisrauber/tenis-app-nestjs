import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async criarCategoria(
    criarCategoriaDto: CriarCategoriaDto,
  ): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoriaEncontrada = await this.categoriaModel.findOne({
      categoria,
    });

    if (categoriaEncontrada) {
      throw new BadRequestException('categoria ja existente');
    }

    return await this.categoriaModel.create(criarCategoriaDto);
  }

  async consultarCategorias(): Promise<Categoria[]> {
    return await this.categoriaModel.find().populate('jogadores');
  }

  async consultarCategoriaPeloId(id: string): Promise<Categoria> {
    const categoria = await this.categoriaModel.findById(id);

    if (!categoria) {
      throw new NotFoundException('categoria não encontrada');
    }
    return categoria;
  }

  async consultarCategoriaDeUmJogadorPeloId(
    jogadorId: any,
  ): Promise<Categoria> {
    const categoria = await this.categoriaModel
      .findOne()
      .where('jogadores')
      .in(jogadorId);

    if (!categoria) {
      throw new NotFoundException('categoria não encontrada');
    }
    return categoria;
  }

  async atualizarCategoria(
    id: string,
    atualizarCategoria: AtualizarCategoriaDto,
  ): Promise<void> {
    const categoria = await this.categoriaModel.findById(id);

    if (!categoria) {
      throw new NotFoundException('categoria não encontrada');
    }
    await this.categoriaModel.updateOne({ _id: id }, atualizarCategoria);
  }

  async atribuirJogadorACategoria(params: string[]): Promise<void> {
    const idJogador = params['idJogador'];
    const id = params['id'];

    const categoria = await this.categoriaModel.findById(id);

    const jogadorJaCadastrado = await categoria.jogadores.find(
      (jogador) => jogador == idJogador,
    );

    console.log(jogadorJaCadastrado);

    if (jogadorJaCadastrado) {
      throw new BadRequestException('jogador ja informado na categoria ');
    }

    await this.jogadoresService.consultarJogadoresPeloId(idJogador);

    if (!categoria) {
      throw new NotFoundException('categoria não encontrada');
    }

    categoria.jogadores.push(idJogador);

    await this.categoriaModel.findOneAndUpdate({ _id: id }, categoria);
  }
}
