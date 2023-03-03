/* eslint-disable max-len */
import React, { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { LinearProgress } from '@mui/material';
import ProgressBar from 'react-bootstrap/ProgressBar';

import RecordBlink from './components/RecordBlink';
import Story from './components/Story';
import UserInfoModal from './components/UserInfoModal';
import ZenMode from './components/ZenMode';
import TestModeResults from './components/TestModeResults';

export default function App() {
  const [username, setUsername] = useState('anonymous');
  const [email, setEmail] = useState('none');
  const [data, setData] = useState({});
  const [progress, setProgress] = useState(0);
  const [finishedRecording, setFinishedRecording] = useState(false);
  const [currentTab, setCurrentTab] = useState('test');
  const [dataStream, setDataStream] = useState({});

  return (
    <div className="App">
      <div className="title">Blink!</div>
      <div className="subtitle">Measure your blink rate</div>
      {/* <UserInfoModal setUsername={setUsername} setEmail={setEmail} /> */}
      <RecordBlink username={username} email={email} setProgress={setProgress} setFinishedRecording={setFinishedRecording} setData={setData} setDataStream={setDataStream} currentTab={currentTab} />
      {/* <ProgressBar variant="info" animated now={progress} /> */}
      {currentTab === 'zen' ? <LinearProgress /> : <LinearProgress variant="determinate" value={progress} />}
      <div className="tab-menu">
        <Tabs defaultActiveKey="test" fill justify onSelect={(key) => setCurrentTab(key)}>
          <Tab eventKey="test" title="Test Mode">
            {finishedRecording ? <TestModeResults data={data} /> : <Story />}
          </Tab>
          <Tab eventKey="zen" title="Zen Mode">
            <ZenMode data={dataStream} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
