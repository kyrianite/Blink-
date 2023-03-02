import React from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import stories from '../data/stories';

const randNum = Math.floor(Math.random() * stories.length);
const story = stories[randNum].split('\n').map((s, i) => {
  const newKey = `${randNum}-${i}`;
  return (<p key={newKey}>{s}</p>);
});

export default function Story() {
  return (
    <div className="story-container">
      <SimpleBar style={{ height: '50vh' }}>
        {story}
      </SimpleBar>
    </div>
  );
}
