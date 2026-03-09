from __future__ import annotations

from pydantic import BaseModel, Field

from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import AIMessage

from app.state import MessagesState
from app.models import get_chat_model
from app.tools import get_tool_belt


class VibeResult(BaseModel):
    is_vibe_correct: bool = Field(
        description="True if the tone is friendly and helpful, False if it's robotic or rude."
    )


def call_model(state: MessagesState):
    model = get_chat_model().bind_tools(get_tool_belt())
    return {"messages": [model.invoke(state["messages"])]}


def vibe_checker(state: MessagesState):
    # Safety: don't loop more than twice
    if len(state["messages"]) > 6:
        return {"messages": [AIMessage(content="VIBE_CHECK:PASS")]}

    prompt = ChatPromptTemplate.from_template(
        "Analyze the following response for 'vibe'. "
        "We want 'Friendly Expert'. "
        "If it's too dry, say False.\n\n"
        "Response: {response}"
    )

    # Structured output critic model
    critic = get_chat_model(
        model_name="gpt-4.1-mini"
    ).with_structured_output(VibeResult)

    result = critic.invoke(
        prompt.format(response=state["messages"][-1].content)
    )

    decision = "PASS" if result.is_vibe_correct else "FAIL"

    return {
        "messages": [
            AIMessage(content=f"VIBE_CHECK:{decision}")
        ]
    }


def route_after_agent(state: MessagesState):
    if getattr(state["messages"][-1], "tool_calls", None):
        return "tools"
    return "vibe_check"


def route_after_vibe(state: MessagesState):
    last_content = state["messages"][-1].content

    if "PASS" in last_content:
        return END

    return "agent"


def build_vibe_graph():
    workflow = StateGraph(MessagesState)

    workflow.add_node("agent", call_model)
    workflow.add_node("action", ToolNode(get_tool_belt()))
    workflow.add_node("vibe_check", vibe_checker)

    workflow.add_edge(START, "agent")

    workflow.add_conditional_edges(
        "agent",
        route_after_agent,
        {
            "tools": "action",
            "vibe_check": "vibe_check",
        },
    )

    workflow.add_edge("action", "agent")

    workflow.add_conditional_edges(
        "vibe_check",
        route_after_vibe,
        {
            "agent": "agent",
            END: END,
        },
    )

    return workflow.compile()


graph = build_vibe_graph()