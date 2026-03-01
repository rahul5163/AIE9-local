# 🏗️ System Architecture: Agentic RAG for Diagnostics

This architecture leverages **LangGraph v0.6.7** to orchestrate a deterministic diagnostic flow, utilizing metadata-filtered retrieval and conditional external search.

graph TD
    classDef user fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef flow fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef storage fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef eval fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    User(["User Question"]):::user
    FastAPI["FastAPI Endpoint"]:::flow

    subgraph Agent_Orchestrator ["LangGraph Agent Orchestration"]
        Planner["Planner Node (Item ID + Query Classification)"]
        ItemRet["Item Retrieval (Metadata Filter: type=item)"]
        SignalExt["Signal Extraction (CTR, Conversion, Rank, Overlap)"]
        KnowRet["Knowledge Retrieval (Metadata Filter: type=knowledge)"]
        External{"Strategic Query?"}
        Tavily["Tavily API (External Search)"]
        LLMSynth["Synthesis Node (GPT-4o)"]
    end

    Pinecone[("Pinecone Vector DB (AWS Serverless)")]:::storage
    LangSmith(["LangSmith (Tracing & Debugging)"]):::eval
    RAGAS(["RAGAS Evaluation (Offline)"]):::eval

    User --> FastAPI
    FastAPI --> Planner

    Planner --> ItemRet
    Planner --> KnowRet
    Planner --> External

    ItemRet --- Pinecone
    KnowRet --- Pinecone

    ItemRet --> SignalExt

    SignalExt --> LLMSynth
    KnowRet --> LLMSynth

    External -- "Yes" --> Tavily --> LLMSynth
    External -- "No" --> LLMSynth

    LLMSynth --> FastAPI

    Agent_Orchestrator -.-> LangSmith
    FastAPI -.-> RAGAS