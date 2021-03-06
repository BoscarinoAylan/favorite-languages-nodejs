const {
    listarLinguagens,
    curtirLinguagem,
    detalhesLinguagem
} = require('../repository/linguagens');

const listar = (req, res, next) => {
    const idUsuario = res.locals.payload.id;

    return listarLinguagens(idUsuario)
        .then(linguagens => res.json(linguagens))
        .catch(err => next(err));
};

const curtir = (req, res, next) => {
    const idLinguagem = req.params.id;
    const idUsuario = res.locals.payload.id;

    return curtirLinguagem(idLinguagem, idUsuario)
        .then(disponivel => {
            if (!disponivel) {
                return res
                    .status(409)
                    .end();
            }
            return res.end();
        })
        .catch(err => next(err));
};

const detalhes = (req, res, next) => {
    return detalhesLinguagem(req.params.id)
        .then(linguagem => res.json({ linguagem }))
        .catch(err => next(err));
};

module.exports = { listar, curtir, detalhes };
