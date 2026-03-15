"use client";

import { useState } from "react";

export default function Home() {

  const [messages, setMessages] = useState<
    { role: "user" | "agent"; content: string }[]
  >([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");

  const [signals, setSignals] = useState<any>(null);
  const [parsed, setParsed] = useState<any>(null);

  const [showRaw, setShowRaw] = useState(false);



  function parseAgentOutput(text: string) {

    const sections = {
      category: "",
      signals: "",
      primaryAction: "",
      alternatives: "",
      risk: "",
      confidence: ""
    };

    const lines = text.split("\n");

    let current = "";

    for (const line of lines) {

      const trimmed = line.trim();

      if (trimmed.startsWith("Diagnosis Category")) {
        current = "category";
        continue;
      }

      if (trimmed.startsWith("Signal Breakdown")) {
        current = "signals";
        continue;
      }

      if (trimmed.startsWith("Recommended Primary Action")) {
        current = "primaryAction";
        continue;
      }

      if (trimmed.startsWith("Alternative Actions")) {
        current = "alternatives";
        continue;
      }

      if (trimmed.startsWith("Business Risk Assessment")) {
        current = "risk";
        continue;
      }

      if (trimmed.startsWith("Confidence Level")) {
        current = "confidence";
        continue;
      }

      if (current && trimmed.length > 0) {
        sections[current] += trimmed + " ";
      }

    }

    return sections;

  }

  function parseSignalBreakdown(text: string) {

    const visibilityMatch = text.match(/Visibility Analysis:(.*?)(?=- Demand Analysis:|Demand Analysis:)/s);
    const demandMatch = text.match(/Demand Analysis:(.*?)(?=- Cannibalization Analysis:|Cannibalization Analysis:)/s);
    const cannibalMatch = text.match(/Cannibalization Analysis:(.*)/s);
  
    return {
      visibility: visibilityMatch ? visibilityMatch[1].trim() : "",
      demand: demandMatch ? demandMatch[1].trim() : "",
      cannibalization: cannibalMatch ? cannibalMatch[1].trim() : ""
    };
  
  }


  function extractSignals(text: string) {

    const impressionsMatch =
      text.match(/(\d[\d,]*)\s*impressions/i) ||
      text.match(/impressions.*?(\d[\d,]*)/i);
  
    const conversionMatch =
      text.match(/conversion rate.*?(\d+\.?\d*)%/i);
  
    const overlapMatch =
      text.match(/overlap score.*?(\d+\.?\d*)/i);
  
    const visibility = impressionsMatch
      ? Number(impressionsMatch[1].replace(/,/g, ""))
      : null;
  
    const conversion = conversionMatch
      ? Number(conversionMatch[1])
      : null;
  
    const cannibalization = overlapMatch
      ? Number(overlapMatch[1])
      : null;
  
    return { visibility, conversion, cannibalization };
  }



  function signalColor(type: string, value: number | null) {

    if (value === null) return "text-gray-500";

    if (type === "conversion") {
      if (value < 4) return "text-red-500";
      if (value < 6) return "text-yellow-600";
      return "text-green-600";
    }

    if (type === "visibility") {
      if (value < 5000) return "text-red-500";
      if (value < 10000) return "text-yellow-600";
      return "text-green-600";
    }

    if (type === "cannibalization") {
      if (value > 0.6) return "text-red-500";
      if (value > 0.4) return "text-yellow-600";
      return "text-green-600";
    }

    return "text-gray-500";

  }



  const handleSubmit = async () => {

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages([userMessage]);
    setParsed(null);
    setSignals(null);
    setShowRaw(false);

    setLoading(true);

    try {

      setStage("🔎 Analyzing item signals...");
      await new Promise((r) => setTimeout(r, 500));

      setStage("📚 Retrieving merchandising knowledge...");
      await new Promise((r) => setTimeout(r, 500));

      setStage("🧠 Generating decision recommendations...");

      const res = await fetch("http://127.0.0.1:10000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      const parsedOutput = parseAgentOutput(data.answer);
      const breakdown = parseSignalBreakdown(parsedOutput.signals);
      parsedOutput.breakdown = breakdown;
      const signalData = extractSignals(data.answer);

      setParsed(parsedOutput);
      setSignals(signalData);

      setMessages([
        userMessage,
        { role: "agent", content: data.answer }
      ]);

    } catch (err) {

      setMessages([
        userMessage,
        { role: "agent", content: "Error contacting backend." }
      ]);

    }

    setStage("");
    setLoading(false);

  };


  const latestAgentMessage =
    messages.filter((m) => m.role === "agent").slice(-1)[0];



  return (

    <main className="min-h-screen bg-gray-50 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          Retail Decision Intelligence Agent
        </h1>

        <p className="text-gray-600 mb-2">
          Diagnose item performance and recommend merchandising interventions
        </p>

        <div className="text-sm text-gray-500 mb-8">
          Query → Signal Analysis → Knowledge Retrieval → Decision Engine
        </div>



        {/* Query */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex gap-2 mb-3">

            <input
              className="flex-1 p-3 border rounded-lg"
              placeholder="Example: Improve ITEM_001"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Analyze
            </button>

          </div>

          <div className="text-sm text-gray-500">
            Try: Diagnose ITEM_101 • Improve ITEM_205 • Suggest actions for ITEM_432
          </div>

        </div>



        {/* Agent reasoning */}

        {loading && (

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">

            <div className="font-semibold mb-2">
              Agent reasoning
            </div>

            <div className="animate-pulse text-sm">
              {stage}
            </div>

          </div>

        )}



        {/* Signals */}

        {signals && (

          <div className="bg-white shadow rounded-lg p-6 mb-8">

            <div className="border-b pb-2 mb-4 text-lg font-semibold">
              Item Performance Signals
            </div>

            <div className="grid grid-cols-3 gap-6 text-sm">

              <div>
                <div className="text-gray-500">Conversion</div>
                <div className={`text-2xl font-bold ${signalColor("conversion", signals.conversion)}`}>
                  {signals.conversion ?? "N/A"}%
                </div>
                <div className="text-xs text-gray-500">
                  Customer purchase efficiency
                </div>
              </div>

              <div>
                <div className="text-gray-500">Shelf Visibility</div>
                <div className={`text-2xl font-bold ${signalColor("visibility", signals.visibility)}`}>
                  {signals.visibility ?? "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  Item discoverability in search
                </div>
              </div>

              <div>
                <div className="text-gray-500">Cannibalization</div>
                <div className={`text-2xl font-bold ${signalColor("cannibalization", signals.cannibalization)}`}>
                  {signals.cannibalization ?? "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  Category overlap risk
                </div>
              </div>

            </div>

          </div>

        )}



        {/* Diagnosis */}

        {parsed && (

          <div className="grid grid-cols-2 gap-6 mb-8">

            <div className="bg-white shadow rounded-lg p-5">

              <div className="border-b pb-2 mb-4 font-semibold">
                🧠 Agent Diagnosis
              </div>

              <div className="text-sm space-y-3">

                <div>
                  <strong>Diagnosis Category</strong><br />
                  {parsed.category}
                </div>

                <div>
                  <div className="space-y-3">
                  <div className="font-semibold">
                  Signal Breakdown
                  </div>

                  <div className="grid grid-cols-1 gap-3">

                  <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="font-semibold text-red-700 mb-1">
                  Visibility Analysis
                  </div>
                  <div className="text-sm text-gray-700">
                  {parsed.breakdown?.visibility}
                  </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <div className="font-semibold text-yellow-700 mb-1">
                  Demand Analysis
                  </div>
                  <div className="text-sm text-gray-700">
                  {parsed.breakdown?.demand}
                  </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="font-semibold text-green-700 mb-1">
                  Cannibalization Analysis
                  </div>
                  <div className="text-sm text-gray-700">
                  {parsed.breakdown?.cannibalization}
                  </div>
                  </div>

                  </div>

                  </div>


                </div>

              </div>

            </div>



            <div className="bg-white shadow rounded-lg p-5">

              <div className="border-b pb-2 mb-4 font-semibold">
                💡 Recommended Actions
              </div>

              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">

                <div className="font-semibold text-green-800">
                  Primary Action
                </div>

                <div className="text-sm text-green-700">
                  {parsed.primaryAction}
                </div>

              </div>

              <div className="text-sm mb-3">
                <strong>Alternative Actions</strong><br />
                {parsed.alternatives}
              </div>

              <div className="text-sm mb-3">
                <strong>Business Risk Assessment</strong><br />
                {parsed.risk}
              </div>

              <div className="text-sm">
                <strong>Confidence</strong>: {parsed.confidence}
              </div>

              <button
                onClick={() => setShowRaw(!showRaw)}
                className="text-blue-600 text-sm underline mt-3"
              >
                {showRaw ? "Hide Diagnostic Report" : "Show Diagnostic Report"}
              </button>

              {showRaw && latestAgentMessage && (

                <div className="bg-gray-100 border p-3 rounded text-xs whitespace-pre-wrap mt-2">
                  {latestAgentMessage.content}
                </div>

              )}

            </div>

          </div>

        )}



        {/* Capability Cards */}

        <div className="grid grid-cols-3 gap-4 text-sm">

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-semibold mb-1">📊 Analyze Signals</div>
            Detect drivers of item performance using retail metrics.
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-semibold mb-1">📚 Retrieve Knowledge</div>
            Search merchandising intervention knowledge base.
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="font-semibold mb-1">💡 Recommend Actions</div>
            Generate targeted actions to improve item performance.
          </div>

        </div>

      </div>

    </main>

  );

}