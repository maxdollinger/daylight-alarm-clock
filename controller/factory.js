const { routErr } = require('../utils/utils');

exports.sendJSON = async (req, res, next) => {
    if(res.data === undefined || res.data instanceof Error) {
        res.json({
            status: 'error',
            msg: res.data?.message || `Could not ${req.method} for ${req.path}. Sorry`,
            data: res.data?.stack || null,
        })
    } else {
        res.json({
            status: 'success',
            msg: res.msg || `${req.method} for ${req.path} was successfull`,
            data: res.data,
        })
    }
}

exports.get = db => routErr((req,res,next) => {
    res.data = db.get();
    next();
})