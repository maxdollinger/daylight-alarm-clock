const setup = function (c) {
        const { express, cors } = c;

        const app = express();
        app.use((req, res, next) => {
                const ip = req.connection.remoteAddress;

                if (ip.includes('192.168.178') || ip === '::1' || ip.includes('2a02:8071:b688:e00:')) {
                        next();
                } else {
                        console.log(`blocked ip: ${ip}`);
                        res.sendStatus(403);
                }
        });
        app.use(cors());
        app.use(express.json({
                limit: '5kb',
        }));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        const port = process.env.PORT || 8000;
        const server = () => app.listen(port, () => console.log(`${(new Date()).toLocaleString('de-DE')} => server startet on port ${port}`));

        return { app, server };
};

module.exports = setup;
