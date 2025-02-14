import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import {Provider} from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/connections";
import Receivedrequests from "./components/receivedrequests";
import Chatbot from "./components/chatbot";

function App() {
  
  return (
    <>
     <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
            <Route path="/" element={<Body/>}>
              <Route path='/feed' element={<Feed/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/connections" element={<Connections/>}/>
              <Route path="/requestreceived" element={<Receivedrequests/>}/>
              <Route path="/help" element={<Chatbot/>}/>
            </Route>
        </Routes>
      </BrowserRouter>
     </Provider>
    </>
  );
}

export default App
