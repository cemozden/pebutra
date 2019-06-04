module.exports = (app) => {

    app.get('/', (req, res) => {
        res.render('login', { title: 'Pebutra, Your Personal Budget Tracker! | Login' });
    });

};