import { BrowserRouter } from 'react-router-dom';
import routes from './routes';

const Root = () => {
    return (
        <>
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        </>
    );
};

export default Root;