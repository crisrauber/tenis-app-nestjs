import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}
  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email });

    if (jogadorEncontrado) {
      throw new BadRequestException(`email ja cadastrado`);
    }
    return await this.jogadorModel.create(criarJogadorDto);
  }

  async atualizarJogador(
    criarJogadorDto: AtualizarJogadorDto,
    id: string,
  ): Promise<void> {
    const jogadorEncontrado = await this.jogadorModel.findById(id);

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador nao encontrado`);
    }

    return await jogadorEncontrado.updateOne(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find();
  }

  async consultarJogadoresPeloId(id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById(id);

    if (!jogadorEncontrado) {
      throw new NotFoundException('Jogador não encontrado');
    }
    return jogadorEncontrado;
  }

  async deletarJogador(id: string): Promise<void> {
    await this.jogadorModel.deleteOne({ _id: id });
  }
}
