from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

# 앞서 설정한 데이터베이스 관련 파일들 임포트
from backend.database import get_db, engine, Base
import backend.model as model

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
    
@app.get("/api/teams")
def get_all_teams(db: Session = Depends(get_db)):
    try:
        # 1. SQLAlchemy ORM을 통해 'teams' 테이블의 모든 데이터를 조회합니다.
        # models.py에 정의한 relationship 덕분에 team.members(팀원들)도 알아서 같이 긁어옵니다.
        teams = db.query(model.Team).all()
        
        # 2. 파이썬 터미널 창에 데이터가 잘 나오는지 확인용 출력 (디버깅)
        print("\n===== 🔍 데이터베이스에서 팀 목록 로드 완료 =====")
        print(f"총 조회된 팀 개수: {len(teams)}개")
        print("==================================================\n")
        
        # 3. 리액트 컴포넌트들이 기존에 쓰던 데이터 구조([{}, {}, {}])와 완벽히 일치하도록 가공합니다.
        result = []
        for team in teams:
            result.append({
                "id": team.id,
                "name": team.name,
                "description": team.description,
                "createdBy": team.created_by,
                # team_members 테이블에서 member_name만 쏙쏙 뽑아 문자열 배열(["장세미", "고예성"])로 만듭니다.
                "members": [m.member_name for m in team.members] 
            })
            
        return result

    except Exception as e:
        print(f"❌ DB 조회 중 에러 발생: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="데이터베이스에서 팀 목록을 불러오는데 실패했습니다."
        )
    
@app.delete("/api/teams/{team_id}")
def delete_team(team_id: int, db: Session = Depends(get_db)):
    # 1. DB에서 지우려는 팀이 존재하는지 확인
    team = db.query(model.Team).filter(model.Team.id == team_id).first()
    
    # 2. 없으면 404 에러
    if not team:
        raise HTTPException(status_code=404, detail="존재하지 않는 팀입니다.")
    
    try:
        # 3. 팀 삭제 (models.py의 cascade 설정 덕분에 team_members도 알아서 같이 지워집니다)
        db.delete(team)
        db.commit()
        print(f"🗑️ DB에서 [팀 ID: {team_id}] 삭제 완료")
        return {"status": "success", "message": f"{team_id}번 팀이 삭제되었습니다."}
        
    except Exception as e:
        db.rollback()
        print(f"❌ 삭제 중 DB 에러 발생: {e}")
        raise HTTPException(status_code=500, detail="데이터베이스 삭제 실패")

@app.get("/api/teams/{team_id}")
def get_team_by_id(team_id: int, db: Session = Depends(get_db)):
    # 1. URL로 들어온 team_id 값과 일치하는 팀 정보를 MySQL에서 하나 찾습니다.
    team = db.query(model.Team).filter(model.Team.id == team_id).first()
    
    # 2. 없으면 404 에러를 반환합니다.
    if not team:
        raise HTTPException(status_code=404, detail="팀을 찾을 수 없습니다.")
        
    # 3. 리액트 규격에 맞춰 정제하여 리턴합니다.
    return {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "createdBy": team.created_by,
        "members": [m.member_name for m in team.members]
    }