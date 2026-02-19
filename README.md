# Money Muling Detection Engine - RIFT 2026 Hackathon

## ️‍♂️ Project Overview
A specialized financial forensics platform designed to uncover sophisticated "Money Muling" networks using **Graph Theory** and **Temporal Analytics**. This system detects laundering rings that hide within thousands of transactions by identifying specific topological patterns in the money flow.

---

## 👥 Developer Roadmap & Collaboration Map

To ensure maximum efficiency in our 20-hour window, each developer has a dedicated tech stack and specific "Contracts" with other teammates.

---

### 👨‍💻 P1: Backend & Data Architect
**Tech Stack**: Python, FastAPI, Pandas, Pydantic, Multer equivalents.
- **What to Do**:
    - Build the FastAPI server structure.
    - Implement the CSV ingestion pipeline using Pandas.
    - Create Pydantic models to enforce the exact JSON output schema.
- **Expects from Others**:
    - **From P2**: The core detection algorithm functions (`detect_cycles`, etc.).
    - **From P3**: The finalized list of CSV column names to ensure parsing consistency.
- **Deliverables**: A working `/analyze` POST endpoint that returns the required JSON structure.

---

### 🧪 P2: Algorithm & Detection Scientist
**Tech Stack**: Python, NetworkX, NumPy.
- **What to Do**:
    - Implement the Graph logic: Conversion of transactions into a Directed Graph.
    - Write the 3 core detectors:
        1. **Cycle Detector** (DFS/Johnson's Algorithm).
        2. **Smurfing Detector** (Degree analysis + 72hr Temporal check).
        3. **Shell Path Detector** (Chain traversal).
    - Design the "False Positive" filters for Merchants and Payroll.
- **Expects from Others**:
    - **From P1**: Clean transaction data (DataFrames or Objects).
- **Deliverables**: A standalone `detectors.py` library that takes a Graph and returns "Rings" and "Scores."

---

### 🎨 P3: Frontend & State Lead
**Tech Stack**: React, Tailwind CSS, Axios, Lucide Icons.
- **What to Do**:
    - Design the "Forensics Dashboard" (Premium Dark Mode UI).
    - Implement the File Upload logic and API communication.
    - Build the **Fraud Ring Summary Table** and the logic to trigger the JSON download.
- **Expects from Others**:
    - **From P1**: The API Endpoint URL and response schema.
    - **From P4**: The `GraphContainer` component to place into the layout.
- **Deliverables**: The main application shell and end-to-end data flow.

---

### 🕸️ P4: Graph Visualization Specialist
**Tech Stack**: React, Cytoscape.js, CSS.
- **What to Do**:
    - Integrate Cytoscape.js into the React app.
    - Implement high-performance rendering (box-selection, klay/dagre layouts).
    - Map the Backend JSON response to Cytoscape Nodes and Edges.
    - Highlighting logic: Change node/edge colors based on `suspicion_score`.
- **Expects from Others**:
    - **From P1**: The specific node/edge data structure returned by the API.
- **Deliverables**: The `InteractiveGraph` component with tooltips and ring highlighting.

---

## 🏗️ Technical Architecture
### 1. Backend (Python + FastAPI + NetworkX)
- **Engine**: Uses `networkx.DiGraph` (Directed Graph) for all topological queries.
- **Performance**: Pandas is used for pre-processing CSVs and calculating transaction "velocity" (frequency over time).
- **Core Algorithms**:
    - **Cycle Detection**: `nx.simple_cycles` limited to depth 5. Loops indicate layering efforts ($A \to B \to C \to A$).
    - **Smurfing (Fan-in/Fan-out)**: Detects hubs where In-Degree or Out-Degree $\ge 10$ within a sliding 72-hour window.
    - **Shell Detection**: Identifies "pass-through" nodes with low degree ($\le 3$) and zero remaining balance.
- **Scoring Engine**: Combines topological flags and velocity into a 0-100 `suspicion_score`.

### 2. Frontend (React + Tailwind + Cytoscape.js)
- **Cytoscape**: Renders the global graph. Fraud rings are highlighted in **Red**, while potential mules are in **Orange**.
- **Interaction**: Users can click any node to see its transaction history and specific fraud flags.
- **Download**: Generates the high-stakes JSON file directly from the API response.

---

## 🔍 Detailed Algorithm Logic

### A. Circular Fund Routing (Cycles)
Detects cycles of length 3-5. Multiple small hops are a signature move to "clean" money.
- **Implementation**: DFS traversal.
- **Scoring**: Cycles carry the highest weight (Base 40 pts).

### B. Smurfing (The "Fan" Pattern)
 criminals often use many "smurfs" to deposit small amounts below reporting thresholds into a single aggregator account.
- **Fan-in**: $\ge 10$ unique senders $\to$ 1 receiver.
- **Fan-out**: 1 sender $\to \ge 10$ unique receivers.
- **Temporal Constraint**: All related transactions must occur within 72 hours.

### C. Layered Shell Networks
intermediate accounts used solely to pass money forward.
- **Structure**: Path of 3+ hops where intermediate nodes have very low volume (In-Degree = 1, Out-Degree = 1).

---

## 📈 Suspicion Score Formula
The final score is a weighted sum of detected patterns:
$$Score = \min(100, (\text{Cycle} \times 40) + (\text{Smurfing} \times 30) + (\text{Shell} \times 20) + (\text{VelocityBonus}))$$

> [!TIP]
> **False Positive Prevention**: We exclude accounts with standard deviation $< 10\%$ in transaction amounts (likely payroll) or accounts with high In-Degree but low Out-Degree (legitimate merchants).

---

## 📁 Granular Project Structure & File Map

To keep the repository clean during the sprint, please follow this structure. Each file has a clear owner (P1-P4).

```bash
/
├── backend/                  # [P1 & P2 Territory]
│   ├── main.py              # API entry point, Routes, & CORS config (P1)
│   ├── models.py            # Pydantic Schemas for JSON validation (P1)
│   ├── detectors.py         # NetworkX algorithms for Cycles/Smurfing (P2)
│   ├── scoring.py           # Suspicion score weights and calculation (P2)
│   ├── utils.py             # CSV loading & Temporal formatting (P1)
│   └── requirements.txt     # Python dependencies
│
├── frontend/                # [P3 & P4 Territory]
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # Main layout & Stat summary grid (P3)
│   │   │   ├── FileUploader.jsx  # CSV drag-and-drop + Axios logic (P3)
│   │   │   ├── GraphDisplay.jsx  # Cytoscape.js core & highlighting (P4)
│   │   │   ├── RingSummary.jsx   # Results table & Search filter (P3)
│   │   │   └── ExportButton.jsx  # JSON download functionality (P3)
│   │   ├── utils/
│   │   │   └── cytoscapeStyles.js# Custom CSS for Graph Nodes/Edges (P4)
│   │   ├── App.jsx               # State management (JSON data flow)
│   │   └── index.css             # Tailwind & Forensics theme styles
│   ├── tailwind.config.js       # Custom colors (Matrix Green, Alert Red)
│   └── package.json             # React, Cytoscape, Tailwind, Lucide
│
├── .gitignore               # Ignore node_modules, pycache, and env
└── README.md                # Project Blueprint & Submission Info
```

---

## 🔗 Internal "Contracts" (Developer Dependencies)

| Destination | Source | What is needed? |
| :--- | :--- | :--- |
| **P1 (API)** | **P2 (Algorithms)** | Functions like `get_fraud_rings(graph)` that return a list of dicts. |
| **P3 (Dashboard)** | **P1 (API)** | A sample JSON response to build the frontend interfaces while backend is in dev. |
| **P4 (Graph)** | **P3 (Dashboard)** | The raw list of `fraud_rings` passed as a Prop once the upload completes. |
| **ALL** | **P2 (Algorithms)** | Agreement on the threshold for "High Suspicion" (e.g., Score > 80). |

---

---

## 🛠️ Technical Implementation Guide (Role-by-Role)

### 👨‍💻 P1: Backend Setup & API
1. **Init**: Create `requirements.txt` with `fastapi, uvicorn, pandas, networkx, python-multipart`.
2. **Boilerplate**:
   ```python
   from fastapi import FastAPI, UploadFile, File
   import pandas as pd
   import io

   app = FastAPI()

   @app.post("/analyze")
   async def analyze(file: UploadFile = File(...)):
       contents = await file.read()
       df = pd.read_csv(io.BytesIO(contents))
       # df logic here
       return result # Must match JSON EXACT Schema
   ```
3. **Task**: Ensure `timestamp` is converted using `pd.to_datetime(df['timestamp'])`.

### 🧪 P2: Detection Logic (The "Brain")
1. **Graph Creation**:
   ```python
   import networkx as nx
   G = nx.from_pandas_edgelist(df, 'sender_id', 'receiver_id', ['amount'], create_using=nx.DiGraph())
   ```
2. **Cycle Logic**:
   ```python
   # Detect cycles length 3-5
   cycles = [c for c in nx.simple_cycles(G) if 3 <= len(c) <= 5]
   ```
3. **Smurfing Logic**:
   - Filter `df` by a sliding 72h window.
   - Count unique `sender_id` per `receiver_id` (Fan-in).
   - If count > 10, flag as smurfing.

### 🎨 P3: Frontend & Dashboard
1. **Upload**: Use a standard `<input type="file">` and `FormData` to send to P1's endpoint.
2. **State**: Save the big JSON response in a global object.
3. **Table**: Map over `fraud_rings` to display in a searchable table.

### 🕸️ P4: Cytoscape Graph Rendering
1. **Element Mapping**:
   ```javascript
   const elements = [
     ...accounts.map(acc => ({ data: { id: acc.account_id, score: acc.suspicion_score } })),
     ...transactions.map(tx => ({ data: { source: tx.sender_id, target: tx.receiver_id } }))
   ];
   ```
2. **Styling**: Use `mapData(score, 0, 100, 'gray', 'red')` for node background color.
3. **Layout**: Use `'dagre'` or `'cose'` for a clean directed flow.

---

## 📈 Suspicion Score Formula (Standardized)
All developers should follow this weightage:
- **Cycle**: 40 points
- **Smurfing**: 30 points
- **Shell Network**: 20 points
- **High Velocity (>5 tx/day)**: 10 points

---

## 🎯 Verification (Final Checklist)
- [ ] JSON contains `suspicious_accounts` array?
- [ ] `suspicion_score` is a Float 0-100?
- [ ] `detected_patterns` handles multiple flags?
- [ ] CSV Upload to Results time is < 30s?
