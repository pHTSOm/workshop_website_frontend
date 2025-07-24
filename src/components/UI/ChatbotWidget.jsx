import { useState } from "react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const openChatbot = () => {
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat button (hidden when chat is open) */}
      {!isOpen && (
        <div
          className="chatbot-button"
          onClick={openChatbot}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            background: "#007bff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            color: "white",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.background = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.background = "#007bff";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
      )}

      {/* Floating chat window (bottom right, not modal) */}
      {isOpen && (
        <div
          className="chatbot-floating-window"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            maxWidth: "95vw",
            height: "500px",
            maxHeight: "80vh",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1001,
            overflow: "hidden",
          }}
        >
          <div
            className="chatbot-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 20px",
              background: "#007bff",
              color: "white",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              Shop Assistant
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Minimize button */}
              <button
                className="minimize-button"
                onClick={closeChatbot}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: 0,
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  transition: "background-color 0.2s ease",
                }}
                title="Minimize"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="5" y="11" width="14" height="2" rx="1" />
                </svg>
              </button>
            </div>
          </div>
          <div
            className="chatbot-body"
            style={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <iframe
              src="/chatbot-simple.html"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Chatbot"
              frameBorder="0"
            />
          </div>
        </div>
      )}
    </>
  );
}
