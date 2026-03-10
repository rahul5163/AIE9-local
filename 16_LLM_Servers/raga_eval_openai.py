import os
from dotenv import load_dotenv

from datasets import Dataset
from ragas import evaluate
from ragas.metrics import Faithfulness, AnswerRelevancy, ContextPrecision, ContextRecall

from langchain_openai import ChatOpenAI, OpenAIEmbeddings

load_dotenv()

# ---------------------------------------------------
# OpenAI models
# ---------------------------------------------------

llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=os.environ["OPENAI_API_KEY"],
    temperature=0,
    max_tokens=4096
)

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small"
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
    
    "Kittens typically receive their first rabies vaccine at around 12 weeks of age depending on local regulations.",
    
    "The feline leukemia virus vaccine protects against FeLV, a contagious virus that can cause immune suppression, anemia, and cancer.",
    
    "Booster vaccines help maintain immunity because protection from earlier vaccines can decrease over time.",
    
    "Adult cats typically receive booster vaccinations every 1–3 years depending on vaccine type and risk factors."
]

# ---------------------------------------------------
# YOUR SAVED RAG ANSWERS (replace with your real ones)
# ---------------------------------------------------

answers = [
    "Core vaccines for kittens include feline panleukopenia (FPV), feline herpesvirus-1 (FHV-1), feline calicivirus (FCV), and rabies.",
    "Kittens usually receive their first rabies vaccine at approximately 12 weeks of age.",
    "The feline leukemia virus vaccine protects cats from FeLV, which can cause immune suppression and cancer.",
    "Booster vaccines maintain immunity because vaccine protection can decrease over time.",
    "Adult cats generally receive booster vaccinations every 1–3 years depending on risk factors."
]

# ---------------------------------------------------
# retrieved contexts (use the ones from your run if you saved them)
# ---------------------------------------------------

contexts = [
    ["Core kitten vaccines include FPV, FHV-1, FCV and rabies."],
    ["Rabies vaccination for kittens typically begins around 12 weeks."],
    ["FeLV vaccine protects cats from feline leukemia virus infection."],
    ["Booster shots reinforce immunity as vaccine protection declines."],
    ["Adult cats receive boosters every 1-3 years depending on risk."]
]

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

print("\nRunning RAGAS evaluation with OpenAI...\n")

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

print("\nOpenAI Evaluation Results\n")
print(results)