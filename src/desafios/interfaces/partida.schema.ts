import { Schema } from 'mongoose';

export const PartidaSchema = new Schema(
  {
    categoria: { type: String },
    def: {
      type: Schema.Types.ObjectId,
      ref: 'Jogador',
    },
    jogadores: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Jogador',
      },
    ],
    resultado: [
      {
        set: { type: String },
      },
    ],
  },
  { timestamps: true, collection: 'partidas' },
);
