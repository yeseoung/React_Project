# backend/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

# 🌟 이 클래스 이름이 'Team'으로 정확히 선언되어 있어야 합니다!
class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_by = Column(String(50), nullable=False)

    # 팀이 삭제되면 멤버도 함께 삭제되도록 설정
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    member_name = Column(String(50), nullable=False)

    team = relationship("Team", back_populates="members")