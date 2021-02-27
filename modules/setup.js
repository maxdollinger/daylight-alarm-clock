const setup = function ({cors, express, utils, api}) {
        const app = express();
        app.use(cors())
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        const port = process.argv[2] === 'prod' ? 80 : 8000;
        const server = () => app.listen(port, () => console.log(`${utils.formateTime()} => server startet on port ${port}`));

        //Endpoints
        app.use('/api', api);


        return {app, server};
};

module.exports = setup;
