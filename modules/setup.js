const setup = function ({ express, cors }) {
        const app = express();

        process.env.IPFILTER && app.use((req, res, next) => {
                const {IPV4, IPV6} = process.env;
                const ip = req.connection.remoteAddress;

                if (ip.startsWith(IPV4) || ip === '::1' || ip.startsWith(IPV6)) {
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
