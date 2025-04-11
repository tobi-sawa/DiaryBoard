from fastapi import Form
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
from passlib.context import CryptContext
from datetime import datetime
from typing import List

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Token(BaseModel):
    access_token: str
    token_type: str

class OAuth2PasswordRequestFormWithTeam(OAuth2PasswordRequestForm):
    def __init__(
        self,
        username: str = Form(...),
        password: str = Form(...),
        team_id: str = Form(...),
        is_admin: bool = False,  # 追加
    ):
        super().__init__(username=username, password=password)
        self.team_id = team_id
        self.is_admin = is_admin  # is_admin をクラスの属性として設定

        
class UserPydantic(BaseModel):
    user_id: str
    name: str
    team_id: str
    password: str
    main_language: int
    learn_language: int
    def hash_password(self):
        self.password = pwd_context.hash(self.password)

class UserCreate(BaseModel):
    user_id: str
    team_id: str
    password : str
    name: str
    main_language: int
    learn_language: int
    def hash_password(self):
        self.password = pwd_context.hash(self.password)

class TeamCreate(BaseModel):
    team_name: str
    team_id : str
    country: List[str]
    age: str
    member_count : int
    
class DiaryCreate(BaseModel):
    title: str
    content: str

class GetQuiz(BaseModel):
    user_id:str
    diary_id:int

class Multilingual_DiaryCreate(BaseModel):
    user_id :str
    language_id : int
    title : str
    diary_time :datetime
    content : str
    
class QuizCreate(BaseModel):
    diary_id : int
    question : str
    correct : str
    a : str
    b : str
    c : str
    d : str

class Multilingual_QuizCreate(BaseModel):
    diary_id : int
    language_id : int
    question : str
    correct : str
    a : str
    b : str
    c : str
    d : str

class AnswerCreate(BaseModel):
    quiz_id : int
    diary_id :int
    choices : str

class Change_User(BaseModel):
    user_name: Optional[str] = None  # デフォルト値を設定
    learn_language: Optional[int] = 0

class Change_team(BaseModel):
    country: List[str]
    age: str
    
class Category(BaseModel):
    category1 :int
    category2 :int
    
class SelectedQuiz(BaseModel):
    selected_quizzes : List[int]

#データベース内のユーザーデータモデル
class UserInDB(UserCreate):
   hashed_password: str

class ReactionRequest(BaseModel):
    diary_id: int
    emoji: str

class TeacherLogin(BaseModel):
    password: str
    
class UserResponse(BaseModel):
    user_id: str
    team_id: str
    name: str
    password: str
    main_language: int
    learn_language: int
    answer_count: int
    diary_count: int
    nickname: str = None
    is_admin: bool
    
class UserRequest(BaseModel):
    user_id:str
    
class PasswordResetRequest(BaseModel):
    team_id: str
    user_id: str
    new_password: str
    def hash_password(self):
        self.new_password = pwd_context.hash(self.new_password)