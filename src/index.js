import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Congklak from './components/Congklak';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Congklak />, document.getElementById('root'));
registerServiceWorker();
