import { createRoot } from 'react-dom/client';
import Root from '@root/root';
import '@stylesheets/main.scss';
import '@stylesheets/colors.scss';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root/>);
