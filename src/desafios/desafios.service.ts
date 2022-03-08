import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio-dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio-dto';
import { atribuirDesafioPartida } from './dtos/atribuir-desafio-partida.dto';
import { Partida } from './interfaces/partida.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriaService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { solicitante, jogadores } = criarDesafioDto;

    const jogadoresCadastrados =
      await this.jogadoresService.consultarTodosJogadores();

    jogadores.map((jogador) => {
      const jogadorCadastrado = jogadoresCadastrados.find(
        (jogadorCadastrado) => jogadorCadastrado._id == jogador,
      );

      if (!jogadorCadastrado) {
        throw new BadRequestException(`o id ${jogador} nao e um jogador!`);
      }
    });

    await this.jogadoresService.consultarJogadoresPeloId(solicitante);

    if (!jogadores.find((jogador) => jogador === solicitante)) {
      throw new BadRequestException(
        'o jogador solicitante nao existe dentre os jogadores',
      );
    }

    const categoria =
      await this.categoriaService.consultarCategoriaDeUmJogadorPeloId(
        solicitante,
      );

    const data = {
      ...criarDesafioDto,
      categoria: categoria._id,
      dataHoraSolicitacao: new Date(),
      status: DesafioStatus.PENDENTE,
    };

    return await this.desafioModel.create(data);
  }

  async consultarTodosDesafios(): Promise<Desafio[]> {
    return this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida');
  }

  async consultarDesafiosDoJogador(idJogador: any): Promise<Desafio[]> {
    return this.desafioModel
      .find()
      .where('jogadores')
      .in(idJogador)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida');
  }

  async atualizarDesafio(
    id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafio = await this.desafioModel.findById(id);

    if (!desafio) {
      throw new NotFoundException('desafio não encontrado');
    }

    atualizarDesafioDto.dataHoraResposta = new Date();

    await this.desafioModel.updateOne({ _id: id }, atualizarDesafioDto);
  }

  async cancelarDesafio(id: string): Promise<void> {
    const desafio = await this.desafioModel.findById(id);

    if (!desafio) {
      throw new NotFoundException('desafio não encontrado');
    }

    await this.desafioModel.updateOne(
      { _id: id },
      {
        status: DesafioStatus.CANCELADO,
      },
    );
  }

  async atribuirDesafioPartida(
    id: string,
    atribuirDesafioPartida: atribuirDesafioPartida,
  ): Promise<void> {
    const { def } = atribuirDesafioPartida;

    const session = await this.desafioModel.startSession();

    session.startTransaction();

    try {
      const desafio = await this.desafioModel.findById(id);

      if (!desafio) {
        throw new NotFoundException('desafio não encontrado');
      }

      await this.jogadoresService.consultarJogadoresPeloId(def.toString());

      const partida = await this.partidaModel.create({
        ...atribuirDesafioPartida,
        jogadores: desafio.jogadores,
        categoria: desafio.categoria,
      });

      console.log(partida);

      await this.desafioModel.updateOne(
        { _id: id },
        {
          partida: partida._id,
          status: DesafioStatus.REALIZADO,
        },
      );

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      session.endSession();
    }
  }
}
