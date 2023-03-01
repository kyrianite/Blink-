import React, { useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import stories from './data/stories';

export default function Story() {
  const randNum = Math.floor(Math.random() * stories.length);
  const story = stories[randNum].split('\n').map((s, i) => {
    const newKey = `${randNum}-${i}`;
    return (<p key={newKey}>{s}</p>);
  });

  return (
    <div className="story-container">
      <SimpleBar style={{ height: '50vh' }}>
        {story}
      </SimpleBar>
    </div>
  );
}
