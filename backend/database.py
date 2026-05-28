from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. 🌐 MySQL 데이터베이스 연결 URL 설정
# 구조: mysql+pymysql://[유저이름]:[비밀번호]@[호스트]:[포트]/[디비이름]
# 본인의 MySQL 비밀번호가 root라면 'password' 자리에 'root'를 입력해주세요.
DATABASE_URL = "mysql+pymysql://root:1234@localhost:3306/makebozo_db"


# 2. ⚡ Engine 생성 (데이터베이스와의 실제 물리적 연결 통로)
# pool_pre_ping=True: 연결이 예기치 않게 끊어졌는지 미리 체크하여 안정성을 높이는 옵션입니다.
engine = create_engine(
    DATABASE_URL, 
    pool_pre_ping=True
)


# 3. 🏭 SessionLocal 생성 (개별 API 요청마다 쓸 연결 열쇠/트럭을 찍어내는 공장)
# autocommit=False: db.commit()을 명시해야만 진짜 DB에 저장되도록 보호합니다.
# autoflush=False: 조회 시마다 불필요하게 임시 데이터를 DB에 밀어넣는 것을 방지합니다.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 4. 🗺️ Base 클래스 생성 (파이썬 클래스와 DB 테이블을 매핑해주는 종합 설계도 묶음철)
Base = declarative_base()


# 5. 🔑 의존성 주입을 위한 get_db 함수 (API마다 세션을 안전하게 열고 닫아주는 일꾼)
def get_db():
    db = SessionLocal() # 요청이 오면 공장에서 세션 트럭 한 대 출고
    try:
        yield db        # API 라우터 함수에게 db 세션을 빌려줌
    finally:
        db.close()      # 응답이 나가면 에러 여부와 상관없이 무조건 안전하게 닫음