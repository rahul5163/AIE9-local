<p align = "center" draggable="false" ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719"
     width="200px"
     height="auto"/>
</p>

## <h1 align="center" id="heading">Session 16: LLM Servers</h1>

| 📰 Session Sheet                                  | ⏺️ Recording                           | 🖼️ Slides                                   | 👨‍💻 Repo       | 📝 Homework                                              | 📁 Feedback                        |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------- | ------------- | -------------------------------------------------------- | ---------------------------------- |
| [LLM Servers](../00_Docs/Session_Sheets/16_LLM_Servers) |[Recording!](https://us02web.zoom.us/rec/share/HDunij9p7eCXeP_OgsRDRjTdWUqiEhDBGWrFJEn1bwWR1wz1jKX6EHXSOM45d0sC.rHiyo_znZ-R8Jh6S) <br> passcode: `D80X^YjL`| [Session 16 Slides](https://www.canva.com/design/DAG-EBu7B5A/POcowC5rDLENSPcSVpbf8g/edit?utm_content=DAG-EBu7B5A&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton) | You are here! | [Session 16 Assignment: LLM Servers](https://forms.gle/Riqvwf6KrZcCRKV86) <br><br> [Demo Day Submission (3/12)](https://forms.gle/7xyuBUn69GX4v6K98)  | [Feedback 3/5](https://forms.gle/W28QFWJXpSS4ZAR6A) |

**⚠️!!! PLEASE BE SURE TO SHUTDOWN YOUR DEDICATED ENDPOINT ON FIREWORKS AI WHEN YOU'RE FINISHED YOUR ASSIGNMENT !!!⚠️**

# Build 🏗️

In today's assignment, we'll be creating Fireworks AI endpoints, and then building a RAG application.

- 🤝 Breakout Room #1
  - Set-up Open Source Endpoint (Instructions [here](./ENDPOINT_SETUP.md)) ((This process may take 15-20min.))
  - Test Endpoint and Embeddings with the `endpoint_slammer.ipynb` notebook.

- 🤝 Breakout Room #2
  - Use the Open Source Endpoints to build a RAG LangGraph application

# Ship 🚢

The completed notebook and your RAG app/notebook!

### Deliverables

- A short Loom of either:
  - the notebook and the RAG application you built for the Main Homework Assignment; or
  - the notebook you created for the Advanced Build

# Share 🚀

Make a social media post about your final application!

### Deliverables

- Make a post on any social media platform about what you built!

Here's a template to get you started:

```
🚀 Exciting News! 🚀

I am thrilled to announce that I have just built and shipped a RAG application powered by open-source endpoints! 🎉🤖

🔍 Three Key Takeaways:
1️⃣
2️⃣
3️⃣

Let's continue pushing the boundaries of what's possible in the world of AI and question-answering. Here's to many more innovations! 🚀
Shout out to @AIMakerspace !

#LangChain #QuestionAnswering #RetrievalAugmented #Innovation #AI #TechMilestone

Feel free to reach out if you're curious or would like to collaborate on similar projects! 🤝🔥
```

# Submitting You Homework [OPTIONAL]

## Main Homework Assignment

Follow these steps to prepare and submit your homework assignment:

1. Follow the instructions in `ENDPOINT_SETUP.md`
2. Replace both `model` values in `endpoint_slammer.ipynb` with the `gpt-oss` endpoint you created in Step 1
3. Run the code cells in `endpoint_slammer.ipynb`
4. Respond to the questions in the section below
5. Build a sample RAG
6. Record a Loom video reviewing what you have learned from this session

**⚠️!!! PLEASE BE SURE TO SHUTDOWN YOUR DEDICATED ENDPOINT ON FIREWORKS AI WHEN YOU HAVE FINISHED YOUR ASSIGNMENT !!!⚠️**

## Questions

### ❓ Question #1:

What is the difference between serverless and dedicated endpoints?

#### ✅ Answer:

_(insert your answer here)_
Serverless endpoints are fully managed inference endpoints where compute resources are dynamically allocated by the provider when a request is made. They require no infrastructure management. 
Dedicated endpoints, on the other hand, provision fixed compute resources such as GPUs that remain allocated to a specific deployment. This guarantees consistent performance, lower latency, and higher token throughput, making them better suited for production systems or high-traffic applications.
Tradeoff ofcourse is higher cost. 

### ❓ Question #2:

Why is it important to consider token throughput and latency when choosing an LLM for user-facing applications?

#### ✅ Answer:
Token throughput and latency directly impact the responsiveness and scalability of user-facing AI applications. Latency determines how quickly the model begins generating a response. High latency can lead to slow interactions and reduced usability in conversational interfaces.
Token throughput refers to how many tokens a model can generate per second. Higher throughput enables faster completion of responses and allows systems to handle more concurrent users. So depending on the usage of application, as it grows, throughput becomes a very important design consideration.


## Activity 1: RAGAS Evaluation with Cost Analysis

Use RAGAS to evaluate your open-source Fireworks AI powered RAG app against an OpenAI `gpt-4.1-mini` powered equivalent. Compare retrieval quality, answer faithfulness, and end-to-end accuracy across both providers.

Additionally, instrument both pipelines with **LangSmith** to capture token usage and cost per query. Use LangSmith's tracing and cost dashboards to compare the total cost of running each provider at scale. Include your evaluation results, cost breakdown, and analysis in your Loom video.

--------------------------------
fireworks ai eval: raga_eval.py
--------------------------------

{'faithfulness': 0.5417, 'answer_relevancy': 0.9356, 'context_precision': 0.7500, 'context_recall': 0.4000}


* faithfulness (0.5417): About half of the answer content is grounded in retrieved context
* answer_relevancy(0.9356): Answers are highly relevant to the user question
* context_precision(0.7500): Most retrieved chunks are useful
* context_recall(0.4000): Retriever is missing some relevant information

--------------------------------
open ai eval: raga_eval_openai.py
--------------------------------

{'faithfulness': 0.7667, 'answer_relevancy': 0.9027, 'context_precision': 1.0000, 'context_recall': 1.0000}

* faithfulness (0.7667): About half of the answer content is grounded in retrieved context
* answer_relevancy(0.9027): Answers are highly relevant to the user question
* context_precision(1.0000): Most retrieved chunks are useful
* context_recall(1.0000): Retriever is missing some relevant information





Conclusion: The initial RAG evaluation showed strong answer relevancy (0.94) but lower faithfulness (0.54), indicating that the model sometimes generated content not fully grounded in the retrieved context. Retrieval performance was the primary bottleneck, with context recall at 0.40, suggesting that the retriever failed to surface some relevant information. When evaluating with curated contexts using OpenAI as the judge model, faithfulness improved significantly to 0.77 while context precision and recall reached 1.0, confirming that generation quality improves when the model receives complete and relevant context. These results suggest that improving retrieval quality would likely yield the largest performance gains for the system.
