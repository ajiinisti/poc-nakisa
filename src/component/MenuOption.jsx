import { Button, Input, Select } from "antd"
import { useState } from "react"

const MenuOption = ({options, setData, data, setVisibleChildren}) => {
    const [selectedEmployee, setSelectedEmployee] = useState()
    const [selectedLead, setSelectedLead] = useState()

    const [newEmployeeName, setNewEmployeeName] = useState()
    const [newEmployeeNik, setNewEmployeeNik] = useState()
    const [newEmployeePosition, setNewEmployeePosition] = useState()
    const [newEmployeeLead, setNewEmployeeLead] = useState()

    const movesEmployee = (employeeHirarchy) => {
        let leadNode = findingNode(employeeHirarchy, selectedLead)

        const removedNode = removeNode(employeeHirarchy, selectedEmployee)
        if (!leadNode.children) {
            leadNode.children = [];
        }
        leadNode.children.push(removedNode);

        setData({ ...employeeHirarchy });
    }

    const addEmployee = (employeeHierarchy) => {
        const parentNode = findingNode(employeeHierarchy, newEmployeeLead);
        if (!parentNode) {
            console.error("Parent node not found!");
            return;
        }
    
        if (!parentNode.children) {
            parentNode.children = [];
        }
        parentNode.children.push({
            id: newEmployeeNik,
            text: newEmployeeName,
            title: newEmployeePosition,
            children: [
            ]
        });
    
        setData({ ...employeeHierarchy });
        setVisibleChildren((prevState) => ({
            ...prevState,
            [newEmployeeNik]: false
        }))
    };

    const removeNode = (nodeStart, targetNodeId) => {
        if (nodeStart.children) {
            const index = nodeStart.children.findIndex(child => child.id === targetNodeId);
            if (index !== -1) {
                return nodeStart.children.splice(index, 1)[0];
            } else {
                for (let child of nodeStart.children) {
                    const removedNode = removeNode(child, targetNodeId);
                    if (removedNode) return removedNode;
                }
            }
        }
        return null;
    };

    const findingNode = (nodeStart, findingNodeId) => {
        if (nodeStart.id === findingNodeId) return nodeStart;
        if (nodeStart.children) {
            for (let child of nodeStart.children) {
                const found = findingNode(child, findingNodeId);
                if (found) return found;
            }
        }
        return null;
    };

    return(
        <div style={{ 
            padding: "10px"
         }}>
            <h3>Moves Employee</h3>
            <p style={{  marginBottom: "0" }}>Employee</p>
            <Select
                style={{ width: "100%" }}
                options={options}
                onChange={(value) => setSelectedEmployee(value)}
            />
            <p style={{  marginBottom: "0" }}>Lead</p>
            <Select
                style={{ width: "100%" }}
                options={options}
                onChange={(value) => setSelectedLead(value)}
            />
            <Button style={{ marginTop: "5px" }} onClick={() => movesEmployee(data)} type="primary">
                Move
            </Button>

            
            <h3>Add Employee</h3>
            <p style={{  marginBottom: "0" }}>Lead</p>
            <Select
                style={{ width: "100%" }}
                options={options}
                onChange={(value) => setNewEmployeeLead(value)}
            />
            <p style={{  marginBottom: "0" }}>Name</p>
            <Input style={{ marginTop: "5px" }} placeholder="Name" onChange={(event) => setNewEmployeeName(event.target.value)}/>
            <p style={{  marginBottom: "0" }}>Nik</p>
            <Input style={{ marginTop: "5px" }} placeholder="NIK" onChange={(event) => setNewEmployeeNik(event.target.value)}/>
            <p style={{  marginBottom: "0" }}>Position</p>
            <Input style={{ marginTop: "5px" }} placeholder="Position" onChange={(event) => setNewEmployeePosition(event.target.value)}/>
            <Button style={{ marginTop: "5px" }} onClick={() => addEmployee(data)} type="primary">
                Add Employee
            </Button>
        </div>
    )
}

export default MenuOption