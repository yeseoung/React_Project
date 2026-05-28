from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

# 앞서 설정한 데이터베이스 관련 파일들 임포트
from database import get_db, engine, Base
import model  # 테이블 모델 정의 파일 (아래 2번 참고)

# 서버 구동 시 테이블이 없으면 자동으로 생성해주는 명령
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS 설정 (리액트 브라우저 요청 허용)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 리액트 데이터 검증 스키마
class TeamInput(BaseModel):
    name: str
    description: Optional[str] = None
    createdBy: str
    members: List[str] = []

# 🚀 터미널 출력 및 DB에 입력하는 라우터
@app.post("/api/teams", status_code=status.HTTP_201_CREATED)
def receive_and_print_team(team_data: TeamInput, db: Session = Depends(get_db)):
    
    # 1. [터미널 출력] 수신된 데이터 확인
    print("\n===== 🚀 프론트엔드로부터 데이터 수신 완료 =====")
    print(f"팀 이 름: {team_data.name}")
    print(f"팀 설 명: {team_data.description}")
    print(f"팀    장: {team_data.createdBy}")
    print(f"팀원목록: {team_data.members}")
    print("===============================================\n")

    try:
        # 2. [DB 입력] 'teams' 테이블에 기본 정보 저장
        new_team = model.Team(
            name=team_data.name,
            description=team_data.description,
            created_by=team_data.createdBy
        )
        db.add(new_team)
        db.commit()          # 🌟 먼저 커밋을 해야 MySQL이 자동으로 생성한 id(기본키)를 받아올 수 있습니다.
        db.refresh(new_team) # 생성된 id를 파이썬 객체에 채워 넣음

        # 3. [DB 입력] 'team_members' 테이블에 배열로 온 팀원들을 한 명씩 매핑하여 저장
        for member_name in team_data.members:
            new_member = model.TeamMember(
                team_id=new_team.id,  # 방금 발급받은 상위 팀의 고유 ID (외래키 연결)
                member_name=member_name
            )
            db.add(new_member)
        
        db.commit() # 팀원 목록 최종 저장 완료

        # 4. 리액트가 다음 페이지로 스무스하게 넘어갈 수 있도록 영수증 데이터 반환
        return {
            "status": "success",
            "id": new_team.id,
            "name": new_team.name,
            "description": new_team.description,
            "createdBy": new_team.created_by,
            "members": team_data.members
        }

    except Exception as e:
        db.rollback() # DB 저장 중 하나라도 삐끗하면 저장 전 상태로 깔끔하게 되돌림 (롤백)
        print(f"❌ DB 저장 중 에러 발생: {e}")
        raise HTTPException(status_code=500, detail="데이터베이스 저장 실패")