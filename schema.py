from pydantic import BaseModel, Field
from typing import List, Dict, Any, Annotated
import operator

# Previous Drug State
class AgentState(BaseModel):
    messages: Annotated[list, operator.add] = Field(default_factory=list)
    current_meds: List[str] = Field(default_factory=list)
    new_drug: str = ""
    logs: Annotated[list, operator.add] = Field(default_factory=list)

# New Appointment State
class AppointmentState(BaseModel):
    patient_id: str = ""
    provider_id: str = ""
    requested_slot: str = ""
    visit_type: str = ""
    urgency_level: str = ""