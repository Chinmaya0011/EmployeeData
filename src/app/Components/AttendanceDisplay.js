import React, { useReducer, useState } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return { ...state, startTime: action.payload };
    case 'pause':
      return { ...state, pauseTime: action.payload };
    case 'end':
      return { ...state, endTime: action.payload };
    default:
      return state;
  }
}

const AttendanceDisplay = () => {
  const [state, dispatch] = useReducer(reducer, {});
  const [start, setStart] = useState(false);
  const [launch, setLaunch] = useState(false);
  const [end, setEnd] = useState(false);

  // Convert Date objects to strings
  let startTimeString = state.startTime ? state.startTime.toLocaleTimeString() : "";
  let pauseTimeString = state.pauseTime ? state.pauseTime.toLocaleTimeString() : "";
  let endTimeString = state.endTime ? state.endTime.toLocaleTimeString() : "";

  let totalTime = state.endTime && state.startTime ? state.endTime - state.startTime : 0;
  // Convert Date objects to strings
  const formatDate = (date) => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  // Convert totalTime to hours, minutes, seconds format
  let totalHours = Math.floor(totalTime / (1000 * 60 * 60));
  let totalMinutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
  let totalSeconds = Math.floor((totalTime % (1000 * 60)) / 1000);


  const attendanceData={
    [formatDate(new Date())]:{
      startTime:state.startTime,
      pauseTime:state.pauseTime,
      endTime:state.endTime,
      totalTime:totalTime,
    }
  }
  return (
    <div>
      {!state.startTime && !state.endTime && <button onClick={() => { dispatch({ type: 'start', payload: new Date() }); setStart(true); }}>Attendance Start</button>}
      {start && !state.endTime && !launch && <button onClick={() => { dispatch({ type: 'pause', payload: new Date() }); setLaunch(true); }}>Launch Break</button>}
      {!state.endTime && <button onClick={() => { dispatch({ type: 'end', payload: new Date() }); setEnd(true); }}>Attendance Stop</button>}

      <p>attendanceStartTime: {startTimeString}</p>
      <p>attendancePauseTime: {pauseTimeString}</p>
      <p>attendanceEndTime: {endTimeString}</p>
      <p>Total Time: {totalHours} hours, {totalMinutes} minutes, {totalSeconds} seconds</p>
    </div>
  );
}

export default AttendanceDisplay;
