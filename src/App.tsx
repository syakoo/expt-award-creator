import { useState } from "react";
import { usePrint } from "./usePrint";
import awardFrame from "./assets/background.png";
import "./App.css";

const DEFAULT_NAME = "山田 太郎";
const DEFAULT_AWARD_CONTENT = "あなたは○○において優秀な成績を収めました";

function App() {
  const [name, setName] = useState(DEFAULT_NAME);
  const [awardContent, setAwardContent] = useState(DEFAULT_AWARD_CONTENT);
  const { ref: certificateRef, handlePrint } = usePrint<HTMLDivElement>();

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
              placeholder={DEFAULT_NAME}
            />
          </div>

          <div className="form-group">
            <label htmlFor="award-content">賞の内容</label>
            <textarea
              id="award-content"
              value={awardContent}
              onChange={(e) => setAwardContent(e.target.value)}
              placeholder={DEFAULT_AWARD_CONTENT}
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
