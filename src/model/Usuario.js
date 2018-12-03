const mongoose = require('mongoose');
const { sign } = require('jsonwebtoken');
const { randomBytes, pbkdf2Sync } = require('crypto');

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    hash: String,
    salt: String
});
UsuarioSchema.methods.definirSenha = function(senha) {
    this.salt = randomBytes(16).toString('hex');
    this.hash = pbkdf2Sync(senha, this.salt, 100000, 512, 'sha512').toString(
        'hex'
    );
};

UsuarioSchema.methods.validarSenha = function(senha, callback) {
    const hash = pbkdf2Sync(senha, this.salt, 100000, 512, 'sha512').toString(
        'hex'
    );
    return this.hash === hash;
};

UsuarioSchema.methods.gerarJWT = function() {
    return sign(
        {
            usuario: {
                email: this.email,
                id: this._id
            }
        },
        'secret',
        { expiresIn: 30000 }
    );
};

UsuarioSchema.methods.dadosAutenticados = function() {
    return {
        usuario: {
            _id: this._id,
            email: this.email,
            nome: this.nome
        },
        token: this.gerarJWT()
    };
};
module.exports = mongoose.model('Usuario', UsuarioSchema);
