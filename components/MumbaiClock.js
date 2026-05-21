'use client';
import { useState, useEffect } from 'react';

export default function MumbaiClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const opts = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' };
      setTime(new Date().toLocaleTimeString('en-GB', opts));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return <span>MUMBAI · {time}</span>;
}
