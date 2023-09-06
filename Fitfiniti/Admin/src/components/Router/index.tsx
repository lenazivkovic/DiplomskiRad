import {Route, Routes, BrowserRouter} from 'react-router-dom'
import { Login } from '../../pages/Login';
import Home from '../../pages/Home';

const Router = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  };
  
  export default Router;
  