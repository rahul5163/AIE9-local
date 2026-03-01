# 🏗️ System Architecture: Agentic RAG for Diagnostics

This architecture leverages **LangGraph v0.6.7** to orchestrate a deterministic diagnostic flow, utilizing metadata-filtered retrieval and conditional external search.

```mermaid
graph TD
    %% Define Styles
    classDef user fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef flow fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef storage fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef eval fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    %% Nodes
    User(["User Question"]):::user
    FastAPI["FastAPI Endpoint"]:::flow
    
    subgraph Agent_Orchestrator ["LangGraph Agent Orchestration"]
        Planner["Planner Node (Query Classification)"]
        ItemRet["Item Retrieval (Metadata Filter: item)"]
        SignalExt["Signal Extraction (Structured Metrics)"]
        KnowRet["Knowledge Retrieval (Metadata Filter: knowledge)"]
        External{"Is Strategic?"} 
        Tavily["Tavily API (External Search)"]
        LLMSynth["Synthesis Node (GPT-4o)"]
    end

    Pinecone[("Pinecone Vector DB (AWS)")]:::storage
    LangSmith(["LangSmith (Tracing)"]):::eval
    RAGAS(["RAGAS (Eval Metrics)"]):::eval

    %% Relationships
    User --> FastAPI
    FastAPI --> Planner
    Planner --> ItemRet
    ItemRet --- Pinecone
    ItemRet --> SignalExt
    SignalExt --> KnowRet
    KnowRet --- Pinecone
    KnowRet --> External
    External -- "Yes" --> Tavily
    External -- "No" --> LLMSynth
    Tavily --> LLMSynth
    LLMSynth --> FastAPI
    
    %% Monitoring/Eval
    Agent_Orchestrator -.-> LangSmith
    LLMSynth -.-> RAGAS