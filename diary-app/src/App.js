import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import NewLogin from './components/newlogin';
import ChatApp from './components/Chat';
import Quiz1 from './components/Quiz1';
import Quiz2 from './components/Quiz2';
import Question1 from './components/Question1';
import Question2 from './components/Question2';
import Question3 from './components/Question3';
import Question4 from './components/Question4';
import Question5 from './components/Question5';
import Answer1 from './components/Answer1';
import Answer2 from './components/Answer2';
import Answer3 from './components/Answer3';
import Answer4 from './components/Answer4';
import Answer5 from './components/Answer5';
import Result from './components/Result';
import Setting from './components/Setting';
import Group from './components/Group';
import Log from './components/log';
import StartPage from './components/StartPage';
import Ranking from './components/Ranking';
import Quiz_log from './components/Quiz _log';
import Teacher_login from './components/Teacher_login';
import Teacher_startpage from './components/Teacher_startpage'
import Teacher_newlogin from './components/Teacher_newlogin'
import Teacher_page from './components/Teacher_page'
import Diary_and_Quiz from './components/Diary_and_Quiz'
import TeamSetting from './components/team_set';
import ResetPassword from './components/reset_password';
import Member from './components/member';
// This is a main App component
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="StartPage" />} />
          <Route path="/newlogin" element={<NewLogin />} />
          <Route path="/Chat" element={<ChatApp />} />
          <Route path="/Quiz1" element={<Quiz1 />} />
          <Route path="/Quiz2" element={<Quiz2 />} />
          <Route path="/Question1/:diaryId" element={<Question1 />} /> {/* diaryIdを受け取るように変更 */}
          <Route path="/Question2/:diaryId" element={<Question2 />} />
          <Route path="/Question3/:diaryId" element={<Question3 />} />
          <Route path="/Question4/:diaryId" element={<Question4 />} />
          <Route path="/Question5/:diaryId" element={<Question5 />} />
          <Route path="/Answer1/:diaryId" element={<Answer1 />} />
          <Route path="/Answer2/:diaryId" element={<Answer2 />} />
          <Route path="/Answer3/:diaryId" element={<Answer3 />} />
          <Route path="/Answer4/:diaryId" element={<Answer4 />} />
          <Route path="/Answer5/:diaryId" element={<Answer5 />} />
          <Route path="/log" element={<Log />} />
          <Route path="/Result/:diaryId" element={<Result />} />
          <Route path="/Setting" element={<Setting />} />
          <Route path="/register" element={<Group />} />
          <Route path="/StartPage" element={<StartPage />} />
          <Route path="/Ranking" element={<Ranking/>}/>
          <Route path='/Quiz_Log' element={<Quiz_log/>} />
          <Route path='/Teacher_login' element={<Teacher_login/>} />
          <Route path='/Teacher_startpage' element={<Teacher_startpage/>} />
          <Route path='/Teacher_newlogin' element={<Teacher_newlogin/>} />
          <Route path='/Teacher_page' element={<Teacher_page/>} />
          <Route path='/Diary_and_Quiz/:user_id' element={<Diary_and_Quiz/>} />
          <Route path="/StartPage" element={<StartPage />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/team_set" element={<TeamSetting />} />
          <Route path="/member" element={<Member />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;