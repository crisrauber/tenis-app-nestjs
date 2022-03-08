import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { Partida } from './partida.interface';

export interface Desafio extends Document {
  categoria: string;
  dataHoraDesafio: Date;
  status: string;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  jogadores: Array<Jogador>;
  partidas: Partida;
}

export interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}
