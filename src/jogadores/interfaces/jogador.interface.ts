import { Document } from 'mongoose';

export interface Jogador extends Document {
  readonly celular: string;
  readonly email: string;
  nome: string;
  ranking: string;
  posicaoRankin: number;
  urlFoto: string;
}
