"use client";

import { useState } from "react";

export default function AICopilot() {
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState({
    selectedTerritory: "Pinofranqueado",
    selectedAlert: null,
    selectedParcel: null,
  });

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context,
        }),
      });

      const data = await response.json();
      const assistantMessage = { role: "assistant", text: data.response || "No response received" };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { role: "assistant", text: "Error connecting to copilot service" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🤖 FIRECYCLE AI Copilot</h1>
        <p className="text-gray-600 mt-2">AI-Powered Assistant for territorial management queries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="mb-2">💬 Ask me anything about FIRECYCLE AI</p>
                  <p className="text-sm">- Forest risk analysis</p>
                  <p className="text-sm">- Intervention planning</p>
                  <p className="text-sm">- Bioeconomy optimization</p>
                  <p className="text-sm">- Maintenance schedules</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask FIRECYCLE AI..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">📍 Context</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Territory</p>
              <p className="font-semibold">{context.selectedTerritory}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Alert</p>
              <p className="font-semibold">{context.selectedAlert || "None"}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Parcel</p>
              <p className="font-semibold">{context.selectedParcel || "None"}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded border-l-2 border-blue-500">
            <p className="text-xs text-blue-700">
              💡 Copilot uses selected territory/alert/parcel context to provide relevant insights
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
