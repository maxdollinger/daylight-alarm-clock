const dependencies = ['alarm', 'sleepTimer', 'led', 'express'];

const api = function(modules) {
    const router = modules.express.Router();

    const endpoints = {
        led: modules.led,
        'sleep-timer': modules.sleepTimer,
        alarm: modules.alarm
    }

    const createResponse = (req, res, next) => {
        const name = req.path.slice(1);
        if(!endpoints.hasOwnProperty(name)) next();

        const module = endpoints[name];
        const method = req.method.toLowerCase();

        if (!module.hasOwnProperty(method)) next();

        if (method === 'post') {
            res.data = module[method](req.body);
        } else {
            res.data = module[method]();
        }

        next();
    }

    const sendJSON = async (req, res, next) => {
        if (res.data === undefined) {
            res.json({
                status: 'error',
                msg: `Could not ${req.method} for ${req.path}. Sorry`,
                data: null,
            })
        } else {
            res.json({
                status: 'success',
                msg: res.msg || `${req.method} for ${req.path} was successfull`,
                data: res.data,
            })
        }
    }

    router.use(createResponse);
    router.use(sendJSON)

    return router;
}

module.exports = () => ({
    dependencies,
    fn: api
})