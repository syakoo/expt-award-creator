import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import awardFrame from "./assets/background.png";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [awardContent, setAwardContent] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imageUrl = canvas.toDataURL("image/png");

    // 非表示のiframeを作成して印刷
    const iframe = document.createElement("iframe");
    iframe.hidden = true;
    document.body.appendChild(iframe);

    // 印刷ダイアログが閉じた後にiframeを削除
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "printComplete") {
        document.body.removeChild(iframe);
        window.removeEventListener("message", handleMessage);
      }
    };
    window.addEventListener("message", handleMessage);

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @page { margin: 0; }
            body { margin: 0; }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" style="width:100%;" onload="window.print()" />
          <script>
            window.onafterprint = () => {
              window.parent.postMessage("printComplete", "*");
            };
          </script>
        </body>
      </html>
    `;
  }, []);

  return (
    <div className="app">
      <h1 className="title">賞状作成ツール</h1>

      <div className="container">
        {/* 入力フォーム */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="name">名前</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
            />
          </div>

          <div className="form-group">
            <label htmlFor="award-content">賞の内容</label>
            <textarea
              id="award-content"
              value={awardContent}
              onChange={(e) => setAwardContent(e.target.value)}
              placeholder="あなたは○○において優秀な成績を収めました"
              rows={4}
            />
          </div>

          <button
            className="print-button"
            onClick={handlePrint}
            disabled={!name || !awardContent}
          >
            賞状を印刷する
          </button>
        </div>

        {/* 賞状プレビュー */}
        <div className="preview-section">
          <h2>プレビュー</h2>
          <div className="certificate-wrapper">
            <div className="certificate" ref={certificateRef}>
              <img
                src={awardFrame}
                alt="賞状フレーム"
                className="certificate-frame"
              />
              <div className="certificate-content">
                <p className="certificate-title">賞状</p>
                <p className="certificate-name">{name || "名前"}</p>
                <p className="certificate-text">殿</p>
                <p className="certificate-body">
                  {awardContent || "賞の内容がここに表示されます"}
                </p>
                <p className="certificate-date">
                  {new Date().toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
