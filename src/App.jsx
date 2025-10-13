import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/connections";
import Receivedrequests from "./components/receivedrequests";
import Chatbot from "./components/chatbot";
import Chatting from "./components/chatting";

function App() {
  return (
    <Provider store={appStore}>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <BrowserRouter basename="/">
          <div className="animate-fade-in">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/requestreceived" element={<Receivedrequests />} />
                <Route path="/help" element={<Chatbot />} />
                <Route path="/chat/:targetUserId" element={<Chatting />} />
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
