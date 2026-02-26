const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema(
  {
    // Referencia de Mongoose (Llave Foránea) al modelo User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El snippet debe pertenecer a un usuario'],
    },
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [3, 'El título debe tener mínimo 3 caracteres'],
    },
    language: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'plaintext',
    },
    code: {
      type: String,
      required: [true, 'El contenido del código es obligatorio'],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Snippet', snippetSchema);
