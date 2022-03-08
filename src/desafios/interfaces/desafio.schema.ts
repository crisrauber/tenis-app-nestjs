import { Schema } from 'mongoose';

export const DesafioSchema = new Schema(
  {
    categoria: {
      type: String,
    },
    status: {
      type: String,
    },
    dataHoraDesafio: { type: Date },
    dataHoraSolicitacao: { type: Date },
    dataHoraResposta: { type: Date },
    solicitante: {
      type: Schema.Types.ObjectId,
      ref: 'Jogador',
    },
    jogadores: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Jogador',
      },
    ],
    partida: {
      type: Schema.Types.ObjectId,
      ref: 'Partida',
    },
  },
  { timestamps: true, collection: 'desafios' },
);
