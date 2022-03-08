import { Schema } from 'mongoose';

export const JogadorSchema = new Schema(
  {
    celular: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    nome: {
      type: String,
    },
    ranking: {
      type: String,
    },
    posicaoRankin: {
      type: Number,
    },
    urlFoto: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'jogadores',
  },
);
