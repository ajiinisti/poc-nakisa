import React, { useEffect, useState } from 'react';
import useData from './useData';
import useRender from './useRender';
import MenuOption from './MenuOption';

const OrgChart = () => {
  const { data, setData } = useData();
  const { renderNodes, visibleChildren, options, createOption, setVisibleChildren } = useRender(data);

  const [offset, setOffset] = useState({ x: 0, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const containerWidth = 1000; // Set this to the width of your container
  const containerHeight = 600; // Set this to the height of your container

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    const zoomFactor = 0.1;
    const newZoom = e.deltaY < 0 ? zoom + zoomFactor : zoom - zoomFactor;
    if (newZoom >= 0.5 && newZoom <= 2) {
      setZoom(newZoom);
    }
  };

  const [nodes, setNodes] = useState([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const { nodes: renderedNodes, lines: renderedLines } = renderNodes(data, 0, 50);
    setNodes(renderedNodes);
    setLines(renderedLines);
  }, [visibleChildren]);

  useEffect(() => {
    createOption(data);
  }, [data]);

  useEffect(() => {
    // Center the root node
    const rootWidth = 125; // Assuming the root node width is 125px
    const totalChartWidth = renderNodes(data, 0, 0).nodes[0].props.subtreeWidth;
    const initialX = (containerWidth / 2) - (totalChartWidth / 2);
    setOffset({ x: initialX, y: 50 });
  }, [data]);

  return (
    <div className="row" style={{ display: 'flex', width: '100%' }}>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          width: '80%',
          height: '92vh',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: '#f0f0f0',
          position: 'relative',
        }}
      >
        <svg
          width="10000"
          height="2000"
          style={{
            position: 'absolute',
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s',
          }}
        >
          {lines}
          {nodes}
        </svg>
      </div>
      <div style={{ width: '20%' }}>
        <MenuOption options={options} setData={setData} data={data} setVisibleChildren={setVisibleChildren}/>
      </div>
    </div>
  );
};

export default OrgChart;
