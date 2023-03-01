import React, { useEffect } from 'react';
import stories from './data/stories';

export default function Story() {
  const randNum = Math.floor(Math.random() * stories.length);
  const story = stories[randNum].split('\n').map((s, i) => {
    const newKey = `${randNum}-${i}`;
    return (<p key={newKey}>{s}</p>);
  });

  return (
    <div className="story-container">
      {story}
    </div>
  );
}
