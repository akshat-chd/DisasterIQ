// src/components/Precautions.jsx

import React from 'react';
import { PRECAUTIONS } from '../utils/precautions';
import { ArrowLeft, ShieldCheck, TriangleAlert } from 'lucide-react';

export default function Precautions({ event, onBack }) {
  const precautionData = PRECAUTIONS[event.type] || [];
  const eventTypeName = event.type.charAt(0).toUpperCase() + event.type.slice(1);

  return (
    <div className="precautions-panel">
      <div className="precautions-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2>{eventTypeName} Safety</h2>
      </div>
      <div className="precautions-list">
        {precautionData.length > 0 ? (
          precautionData.map((item, index) => (
            <div key={index} className="precaution-item">
              <div className="precaution-icon">
                <ShieldCheck size={20} />
              </div>
              <div className="precaution-text">
                <h3>{item.title}</h3>
                <p>{item.tip}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="precaution-item">
             <div className="precaution-icon">
                <TriangleAlert size={20} />
              </div>
              <div className="precaution-text">
                <h3>General Advice</h3>
                <p>Stay informed through official channels and follow guidance from local authorities.</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}