import {
    Routes,
    Route,
} from 'react-router-dom';
import AppWrapper from '@views/wrapper';
import Home from '@views/index';

export default (
    <Routes>
        <Route path="/" element={<AppWrapper/>}>
            <Route index element={<Home/>}/>
        </Route>
    </Routes>
);
