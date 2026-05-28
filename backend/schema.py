from pydantic import BaseModel,Field
from typing import List,Optional

class TeamCreate(BaseModel):
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    createdBy: str = Field(..., min_length=1) # 리액트의 createdBy 매핑
    members: List[str] = []