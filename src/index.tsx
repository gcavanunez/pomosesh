// /* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import Index from './routes/index';
import Experiment from './routes/experiment';
import SiteLayout from './layouts/site';

const wrapper = document.getElementById('root');

if (!wrapper) {
	throw new Error('Wrapper div not found');
}

render(
	() => (
		<Router root={SiteLayout}>
			<Route path="/" component={Index} />
			<Route path="/experiment" component={Experiment} />
		</Router>
	),
	wrapper,
);
