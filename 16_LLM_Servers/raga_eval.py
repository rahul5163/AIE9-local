import os
from dotenv import load_dotenv

from datasets import Dataset
from ragas import evaluate


from ragas.metrics import Faithfulness, AnswerRelevancy, ContextPrecision, ContextRecall

from langchain_openai import ChatOpenAI, OpenAIEmbeddings

# import the RAG graph builder
from app.rag import _get_rag_graph


load_dotenv()

# ---------------------------------------------------
# RAGAS compatibility wrapper
# ---------------------------------------------------

class RagasEmbeddingWrapper(OpenAIEmbeddings):
    def embed_query(self, text: str):
        return self.embed_documents([text])[0]


# ---------------------------------------------------
# models
# ---------------------------------------------------

llm = ChatOpenAI(
    model=os.environ.get(
        "FIREWORKS_CHAT_MODEL",
        "accounts/fireworks/models/gpt-oss-20b"
    ),
    openai_api_key=os.environ["FIREWORKS_API_KEY"],
    openai_api_base="https://api.fireworks.ai/inference/v1",
    max_tokens=4096,
)

embeddings = RagasEmbeddingWrapper(
    model=os.environ.get(
        "FIREWORKS_EMBEDDING_MODEL",
        "accounts/fireworks/models/qwen3-embedding-8b"
    ),
    openai_api_key=os.environ["FIREWORKS_API_KEY"],
    openai_api_base="https://api.fireworks.ai/inference/v1",
    check_embedding_ctx_length=False,
)

# ---------------------------------------------------
# evaluation questions
# ---------------------------------------------------

questions = [
    "What vaccines are considered core for kittens?",
    "At what age should kittens receive their first rabies vaccine?",
    "What disease does the feline leukemia virus vaccine protect against?",
    "Why are booster vaccines important for cats?",
    "How often should adult cats receive vaccinations?"
]

references = [
    "Core vaccines for kittens include feline panleukopenia (FPV), feline herpesvirus-1 (FHV-1), and feline calicivirus (FCV). Rabies is also considered a core vaccine in many regions.",
    
    "Kittens typically receive their first rabies vaccine at around 12 weeks of age, depending on local regulations.",
    
    "The feline leukemia virus vaccine protects against FeLV, a contagious virus that can cause immune suppression, anemia, and cancer.",
    
    "Booster vaccines help maintain immunity because protection from earlier vaccines can decrease over time.",
    
    "Adult cats typically receive booster vaccinations every 1–3 years depending on vaccine type and risk factors."
]

# ---------------------------------------------------
# run RAG pipeline
# ---------------------------------------------------

print("\nRunning RAG pipeline...\n")

graph = _get_rag_graph()

answers = []
contexts = []

for q in questions:

    result = graph.invoke({"question": q})

    answer = result.get("response", "")
    ctx_docs = result.get("context", [])

    answers.append(answer)
    contexts.append([d.page_content for d in ctx_docs])

# ---------------------------------------------------
# dataset
# ---------------------------------------------------

dataset = Dataset.from_dict({
    "question": questions,
    "answer": answers,
    "contexts": contexts,
    "reference": references
})


# ---------------------------------------------------
# RAGAS evaluation
# ---------------------------------------------------

print("\nRunning RAGAS evaluation...\n")

results = evaluate(
    dataset,
    metrics=[
        Faithfulness(),
        AnswerRelevancy(),
        ContextPrecision(),
        ContextRecall()
    ],
    llm=llm,
    embeddings=embeddings
)

print("\nEvaluation Results\n")
print(results)