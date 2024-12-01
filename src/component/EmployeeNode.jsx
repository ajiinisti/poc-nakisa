import React, { useState, useEffect } from 'react';

const EmployeeNode = ({ x, y, subtreeWidth, nodeWidth, nodeHeight, node, onNodeClick }) => {
  const [truncatedText, setTruncatedText] = useState(node.text);
  const [truncatedTitle, setTruncatedTitle] = useState(node.title);

  useEffect(() => {
    const calculateTextWidth = (text) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = '14px bold'; // Same font size and weight used in text
      return context.measureText(text).width;
    };

    // Check if the text exceeds the nodeWidth
    const textWidth = calculateTextWidth(node.text);
    if (textWidth > nodeWidth - 20) { // Subtracting 20px for padding
      let truncated = node.text;
      while (calculateTextWidth(truncated + "...") > nodeWidth - 20 && truncated.length > 0) {
        truncated = truncated.slice(0, -1); // Remove one character at a time
      }
      setTruncatedText(truncated + "...");
    } else {
      setTruncatedText(node.text);
    }
  }, [node.text, nodeWidth]);

  useEffect(() => {
    const calculateTitleWidth = (text) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = '12px'; // Same font size and weight used in text
      return context.measureText(text).width;
    };

    // Check if the text exceeds the nodeWidth
    const textWidth = calculateTitleWidth(node.title);
    if (textWidth > nodeWidth - 20) { // Subtracting 20px for padding
      let truncated = node.title;
      while (calculateTitleWidth(truncated + "...") > nodeWidth - 20 && truncated.length > 0) {
        truncated = truncated.slice(0, -1); // Remove one character at a time
      }
      setTruncatedTitle(truncated + "...");
    } else {
      setTruncatedTitle(node.title);
    }
  }, [node.title, nodeWidth]);

  return (
    <g onClick={() => onNodeClick(node)}>
      <rect
        key={node.id}
        x={x + subtreeWidth / 2 - nodeWidth / 2}
        y={y}
        width={nodeWidth}
        height={nodeHeight}
        fill="white"
        stroke="black"
        rx="15" // Horizontal radius for smooth corners
        ry="15" // Vertical radius for smooth corners
      />
      <text
        key={`${node.id}-text`}
        x={x + subtreeWidth / 2}
        y={y + nodeHeight / 2 - 10}
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          fill: 'black',
          transition: 'all 0.3s ease',
        }}
      >
        {truncatedText}
      </text>
      <text
        key={`${node.id}-title`}
        x={x + subtreeWidth / 2}
        y={y + nodeHeight / 2 + 10}
        textAnchor="middle"
        alignmentBaseline="middle"
        style={{
          fontSize: '12px',
          fill: 'black',
          transition: 'all 0.3s ease',
        }}
      >
        {truncatedTitle}
      </text>
    </g>
  );
};

export default EmployeeNode;
