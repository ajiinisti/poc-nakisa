import { useState } from "react";
import EmployeeNode from "./EmployeeNode";

const useRender = (nodes) => {
    const [options, setOptions] = useState([]);

    const createOption = (node) => {
        const data = {
            "label": node.text,
            "value": node.id
        }

        if (node.children){
            node.children.forEach(child => {
                createOption(child)
            })
        }
        
        setOptions((prevState) => ([
            ...prevState,
            data,
        ]))
    };

    const [visibleChildren, setVisibleChildren] = useState(() => {
        const createVisibilityMap = (node) => {
            const visibilityMap = {
                [node.id]: false, // Initially hide all nodes
            };
        
            if (node.children) {
                node.children.forEach(child => {
                    Object.assign(visibilityMap, createVisibilityMap(child)); // Recursively add children
                });
            }
        
            return visibilityMap;
        };
    
        return createVisibilityMap(nodes);
      });

    const calculateSubtreeWidth = (node) => {
        const nodeWidth = 100;
        const horizontalSpacing = 50;
        if ((!node.children || node.children.length === 0)) {
            return nodeWidth + horizontalSpacing;
        }
        return node.children.reduce((width, child) => width + calculateSubtreeWidth(child), 0);
    };

    const handleNodeClick = (node) => {
        setVisibleChildren((prevState) => ({
          ...prevState,
          [node.id]: !prevState[node.id],
        }));
    };

    const renderNodes = (node, x, y) => {
        const nodeWidth = 125;
        const nodeHeight = 75;
        const verticalSpacing = 150;
        const horizontalSpacing = 75;

        const subtreeWidth = calculateSubtreeWidth(node);

        // Render current node
        const renderedNodes = [];
        const renderedLines = [];
    
        const isNodeVisible = visibleChildren[node.id] !== undefined ? visibleChildren[node.id] : true; 
        if (node.children.length > 0) {
            console.log("node visible = ",isNodeVisible, node," node children visible = ",visibleChildren[node.children[0].id])
        }else{
            console.log("node visible = ",isNodeVisible, node)
        }

        renderedNodes.push(
            <EmployeeNode
                x={x}
                y={y}
                subtreeWidth={subtreeWidth}
                nodeWidth={nodeWidth}
                nodeHeight={nodeHeight}
                node={node}
                onNodeClick={handleNodeClick}
            />
        );

        if (node.children && node.children.length > 0) {
            if (isNodeVisible && node.children) {
                console.log("masuk ke pembuatan child ")
                let currentX = x;

                node.children.forEach((child) => {
                    const childSubtreeWidth = calculateSubtreeWidth(child);
                    const childX = currentX + childSubtreeWidth / 2 - nodeWidth / 2;
                    const childY = y + verticalSpacing;
        
                    renderedLines.push(
                    <line
                        key={`${node.id}-${child.id}-line-vertical`}
                        x1={x + subtreeWidth / 2} 
                        y1={y + nodeHeight} 
                        x2={x + subtreeWidth / 2}
                        y2={childY - horizontalSpacing / 2}
                        stroke="black"
                    />,
                    <line
                        key={`${node.id}-${child.id}-line-horizontal`}
                        x1={x + subtreeWidth / 2}
                        y1={childY - horizontalSpacing / 2}
                        x2={childX + nodeWidth / 2}
                        y2={childY - horizontalSpacing / 2}
                        stroke="black"
                    />,
                    <line
                        key={`${node.id}-${child.id}-line-vertical-to-child`}
                        x1={childX + nodeWidth / 2}
                        y1={childY - horizontalSpacing / 2}
                        x2={childX + nodeWidth / 2}
                        y2={childY}
                        stroke="black"
                    />
                    );
        
                    const childElements = renderNodes(child, currentX, childY);
                    renderedNodes.push(...childElements.nodes);
                    renderedLines.push(...childElements.lines);
        
                    currentX += childSubtreeWidth;
                });
                
            }
        }

        return { nodes: renderedNodes, lines: renderedLines };
    };

    return{
        renderNodes,
        visibleChildren,
        options,
        createOption,
        setVisibleChildren
    }
}

export default useRender