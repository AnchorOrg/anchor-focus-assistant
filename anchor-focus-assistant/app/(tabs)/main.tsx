import React, { useState, useEffect } from 'react';

const Main: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [focusScore, setFocusScore] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isRunning) {
      camera.start();
    } else {
      camera.stop();
    }
  }, [isRunning]);

  const handleButtonClick = () => {
    setIsRunning(!isRunning);
  };

  // ここでフォーカススコアとフォーカス状態を更新するロジックを追加します
  // 例えば、setFocusScore(新しいスコア) や setIsFocused(新しいフォーカス状態) を呼び出します

  return (
    <div>
      <button onClick={handleButtonClick}>
        {isRunning ? '一時停止' : '開始'}
      </button>
      <div>
        <p>フォーカススコア: {focusScore}</p>
        <p>現在フォーカス中: {isFocused ? 'はい' : 'いいえ'}</p>
      </div>
    </div>
  );
};

export default Main;