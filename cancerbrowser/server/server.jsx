var fs = require('fs');
var express = require('express');
var path = require('path');


import React from 'react'
import { renderToString } from 'react-dom/server'

import { Router, RouterContext, match } from 'react-router';
import routes from '../common/routes';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import thunkMiddleware from 'redux-thunk'
import combinedReducers from '../common/reducers';

import fetchComponentData from '../common/utils/fetchData';

const finalCreateStore = applyMiddleware(thunkMiddleware)( createStore );

// console.log( 'env: ', process.env.NODE_ENV )

var app = express();
// Not sure what this was for, was commented out in example
// app.use('/build', express.static(path.join(__dirname, '../build')))

app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/sampledata', express.static(path.join(__dirname, '../dist/sampledata')));

// 啟用新版 webpack HMR 功能
// TODO Enable webpack middleware
// var webpack = require('webpack')
// var webpackDevMiddleware = require('webpack-dev-middleware')
// var webpackHotMiddleware = require('webpack-hot-middleware')
// var config = require('../webpack.config')
// var compiler = webpack(config)
// app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
// app.use(webpackHotMiddleware(compiler))

// server rendering
app.use( ( req, res, next ) => {

	const store = finalCreateStore(combinedReducers);

	match( {routes, location: req.url}, ( error, redirectLocation, renderProps ) => {

		if ( error )
			return res.status(500).send( error.message );

		if ( redirectLocation )
			return res.redirect( 302, redirectLocation.pathname + redirectLocation.search );

		if ( renderProps == null ) {
			// return next('err msg: route not found'); // yield control to next middleware to handle the request
			return res.status(404).send( 'Not found' );
		}

		// console.log( '\nserver > renderProps: \n', require('util').inspect( renderProps, false, 1, true) )
		// console.log( '\nserver > renderProps: \n', require('util').inspect( renderProps.components, false, 3, true) )

		// Fetch data required for the matched routes
		let prom = fetchComponentData(store.dispatch, renderProps.components, renderProps.params)

		.then( () => {

			const initView = renderToString((
				<Provider store={ store }>
				  <RouterContext { ...renderProps } />
				</Provider>
			))

			// console.log('\ninitView:\n', initView);

			let state = JSON.stringify(store.getState());
			// console.log('\nstate: ', state)

			let page = renderFullPage(initView, state)
			// console.log('\npage:\n', page);

			return page;

		})

		.then( page => res.status(200).send(page) )

		.catch( err => res.end(err.message) );
	})
})

function renderFullPage(html, initialState) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>HMS LINCS Cancer Browser</title>
        <link rel="stylesheet" href="/dist/styles.css">
      </head>
      <body>
        <div id="cancerBrowser"><div>${html}</div></div>
        <script>window.$REDUX_STATE = ${initialState}</script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}

// example of handling 404 pages
app.get('*', function(req, res) {
	res.status(404).send('Server.js > 404 - Page Not Found');
})

// global error catcher, need four arguments
app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

process.on('uncaughtException', evt => {
  console.log( 'uncaughtException: ', evt );
})

app.listen(3000, function(){
	console.log('Listening on port 3000');
});
