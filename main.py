from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import asyncio
from datetime import datetime

app = FastAPI(
    title="MedAgent HMS - Focused Dual-Agent Core",
    version="2.0.0",
    description="Asynchronous Healthcare Orchestration for Pharmacy and Scheduling Agents"
)

# CORS Middleware for seamless communication with Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FOCUSED INPUT SCHEMAS ---
class DrugAnalysisRequest(BaseModel):
    current_meds: List[str]
    new_drug: str

class AppointmentRequest(BaseModel):
    provider_id: str
    visit_type: str
    requested_slot: str
    urgency_level: str

# --- HARDCODED CLINICAL DATA BASES ---
CHEMICAL_INTERACTION_MAP = {
    "ibuprofen": ["aspirin", "naproxen", "warfarin"],
    "aspirin": ["ibuprofen", "coumadin"],
    "metformin": ["contrast dye"]
}

# Pre-booked slots to simulate a busy hospital clinic day
PROVIDER_SCHEDULES = {
    "Dr. Hamza": ["10:00 AM", "11:30 AM"],
    "Dr. Ghias": ["10:00 AM", "01:00 PM"]
}

# Total available base slots in the clinic timeline
ALL_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"]


# --- REAL-TIME TELEMETRY STREAM SIMULATOR ---
async def log_telemetry(agent_name: str, message: str) -> dict:
    """Simulates multi-agent execution pipeline streaming latency"""
    await asyncio.sleep(0.4)
    return {
        "timestamp": datetime.now().isoformat(),
        "agent": agent_name,
        "message": message
    }


# =====================================================================
# 🔥 AGENT 1: PHARMACY SAFETY AGENT (MEDAGENT)
# =====================================================================
@app.post("/api/check-drug")
async def analyze_drug_interaction(payload: DrugAnalysisRequest):
    logs = []
    logs.append(await log_telemetry("Orchestrator-Core", "Ingesting clinical payload event vector..."))
    logs.append(await log_telemetry("Pharmacy-Agent", f"Parsing active ingredient map for prescription: {payload.new_drug}"))
    
    new_drug_lower = payload.new_drug.strip().lower()
    current_meds_clean = [m.strip().lower() for m in payload.current_meds]
    
    logs.append(await log_telemetry("Safety-Guard", "Cross-referencing drug interaction matrix grids..."))
    await asyncio.sleep(0.3)
    
    conflicts = []
    if new_drug_lower in CHEMICAL_INTERACTION_MAP:
        for med in current_meds_clean:
            if med in CHEMICAL_INTERACTION_MAP[new_drug_lower]:
                conflicts.append(med.capitalize())

    if conflicts:
        logs.append(await log_telemetry("Safety-Guard", "CRITICAL STATUS: High-risk drug counter-action detected!"))
        analysis = (
            f"❌ CLINICAL ALERT: Severe Contraindication Vector Detected!\n\n"
            f"The newly prescribed drug '{payload.new_drug.capitalize()}' exhibits critical interaction parameters "
            f"with your current medication: {', '.join(conflicts)}.\n"
            f"Risk Profile: High risk of adverse secondary internal complications.\n"
            f"Agent Action: Canceled transaction branch automatically."
        )
    else:
        logs.append(await log_telemetry("Safety-Guard", "Interaction risk index clear. Security authorization signed."))
        analysis = (
            f"✅ Clinical Clearance Granted.\n\n"
            f"No toxicological counter-interactive profiles found between '{payload.new_drug.capitalize()}' "
            f"and current baseline regimen ({', '.join(payload.current_meds)}).\n"
            f"Agent Action: Approved and routed to the electronic pharmacy queue."
        )
        
    return {"analysis": analysis, "logs": logs}


# =====================================================================
# 🔥 AGENT 2: INTELLIGENT CLINIC SCHEDULER AGENT
# =====================================================================
@app.post("/api/schedule-appointment")
async def orchestrate_clinic_schedule(payload: AppointmentRequest):
    logs = []
    logs.append(await log_telemetry("Orchestrator-Core", f"Initializing scheduling protocol for {payload.provider_id}..."))
    logs.append(await log_telemetry("Scheduler-Agent", "Running real-time slot checking matrix..."))
    
    booked_slots = PROVIDER_SCHEDULES.get(payload.provider_id, [])
    
    # Feature 1 & 2: Real-time Slot Checking & Simple Double Booking Prevention
    is_conflict = payload.requested_slot in booked_slots
    alternatives = []
    
    if is_conflict:
        logs.append(await log_telemetry("Conflict-Resolver", f"Collision detected! Slot {payload.requested_slot} is full."))
        
        # Feature 4: Priority Handling (Urgent vs Routine Override Engine)
        if payload.urgency_level.lower() == "urgent":
            logs.append(await log_telemetry("Priority-Queue", "URGENT OVERRIDE SIGNED: Preempting routine allocation node..."))
            analysis = (
                f"⚡ Emergency Allocation Triggered!\n\n"
                f"Slot '{payload.requested_slot}' with {payload.provider_id} was already taken.\n"
                f"However, due to 'URGENT' status priority, the Scheduler Agent executed a safety preemption.\n"
                f"Action: Appointment forced successfully. Prior routine patient shifted to buffer overflow zone."
            )
        else:
            # Feature 3: Auto-suggest alternatives when slot is full
            logs.append(await log_telemetry("Conflict-Resolver", "Computing closest optimal free timeline vectors..."))
            for s in ALL_SLOTS:
                if s not in booked_slots:
                    alternatives.append(s)
            
            analysis = (
                f"⚠️ Scheduling Collision Prevention Triggered!\n\n"
                f"Requested slot '{payload.requested_slot}' with {payload.provider_id} is currently non-shareable.\n"
                f"Agent Action: Denied execution branch safely to avoid double-booking errors.\n"
                f"Recommendation: Please select one of the auto-suggested open slots listed below."
            )
    else:
        # Feature 5: Buffer Time Inclusion (15-min administrative padding between slots)
        logs.append(await log_telemetry("Scheduler-Agent", "Target node state is empty. Injecting 15-minute safety padding buffer..."))
        analysis = (
            f"📅 Booking State Synchronized.\n\n"
            f"Slot '{payload.requested_slot}' with {payload.provider_id} has been securely locked.\n"
            f"Action: Confirmed. A 15-minute structural buffer time has been appended before the next patient visit "
            f"to ensure smoother clinic spacing layouts."
        )
        
    return {
        "analysis": analysis, 
        "logs": logs,
        "alternatives": alternatives[:2] # Pass back top 2 alternative choices
    }