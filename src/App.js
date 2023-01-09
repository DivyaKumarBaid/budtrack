import React from "react";
import { SnackbarProvider } from 'notistack'
import { Auth, AuthLogin } from "./context/Auth";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import './App.css';
import { Nav } from "./components/Nav"
import { LogoNav } from "./components/LogoNav";

function App() {
  // using snackbar
  // const { enqueueSnackbar } = useSnackbar()
  // enqueueSnackbar('This is a success message!', { 'success','error' })
  return (
    <Auth>
      <SnackbarProvider autoHideDuration={5000} maxSnack={3}>
        <Nav />
        <LogoNav />
        <div className="App">
          <Router>
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/signup' element={<Signup />} />
            </Routes>
          </Router>
        </div>
      </SnackbarProvider>
    </Auth>
  );
}

export default App;
