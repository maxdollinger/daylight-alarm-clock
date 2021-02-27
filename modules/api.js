const api = function ({led, sleepTimer, alarm, express}) {
    const endpoints = {
        led,
        'sleep-timer': sleepTimer,
        alarm,
    }

    const router = express.Router();

    const createResponse = (req, res, next) => {
        const name = req.path.slice(1);
        if (!endpoints.hasOwnProperty(name)) next();

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
        const success = res.data !== undefined;

        const status = success ? 'success' : 'error';
        const msg = success
            ? (res.msg || `${req.method} for ${req.path} was successfull`)
            : `Could not ${req.method} for ${req.path}. Sorry`;
        const data = success ? res.data : null;

        res.json({ status, msg, data })
    }

    router.use(createResponse);
    router.use(sendJSON);

    return router;
}

module.exports = api