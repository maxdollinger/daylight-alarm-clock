const setup = function (c) {
        const {express, cors} = c;

        const app = express();
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static('public'));

        const port = process.env.PORT || 8000;
        const server = () => app.listen(port, () => console.log(`${(new Date()).toLocaleString('de-DE')} => server startet on port ${port}`));

        return {app, server};
};

module.exports = setup;
