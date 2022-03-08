import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface Partida extends Document {
  categoria: string;
  def: Jogador;
  jogadores: Array<Jogador>;
  resultado: Array<Resultado>;
}

export interface Resultado {
  set: string;
}
