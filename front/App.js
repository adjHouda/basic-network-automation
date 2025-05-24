import React, { useState } from "react";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState("showCommand");


  const [port, setPort] = useState(5000);


  const [command, setCommand] = useState("show ip interface brief");
  const [showOutput, setShowOutput] = useState("");

  const [interfaces, setInterfaces] = useState([
    { name: "FastEthernet0/0", ip: "192.168.1.1", subnet: "255.255.255.0" },
  ]);
  const [configIfOutput, setConfigIfOutput] = useState("");

  const [networks, setNetworks] = useState(["192.168.1.0", "10.0.0.0"]);
  const [configRipOutput, setConfigRipOutput] = useState("");

  const handleShowCommand = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8080/show-command", {
        routerPort: port,
        command,
      });
      setShowOutput(res.data.output);
    } catch (err) {
      setShowOutput("Error: " + err.message);
    }
  };

  const handleConfigInterfaces = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8080/configure-interfaces", {
        routerPort: port,
        interfaces,
      });
      setConfigIfOutput(res.data.output);
    } catch (err) {
      setConfigIfOutput("Error: " + err.message);
    }
  };

  const handleConfigRip = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8080/configure-rip", {
        routerPort: port,
        networks,
      });
      setConfigRipOutput(res.data.output); //les commandes 
    } catch (err) {
      setConfigRipOutput("Error: " + err.message);
    }
  };


  const updateInterfaceField = (index, field, value) => {
    const newIfs = [...interfaces];
    newIfs[index][field] = value;
    setInterfaces(newIfs);
  };


  const addInterface = () => {
    setInterfaces([...interfaces, { name: "", ip: "", subnet: "" }]);
  };


  const updateNetwork = (index, value) => {
    const newNets = [...networks];
    newNets[index] = value;
    setNetworks(newNets);
  };

 
  const addNetwork = () => {
    setNetworks([...networks, ""]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Netmiko API Tester</h1>

      <div>
        <button onClick={() => setActiveTab("showCommand")}>Show Command</button>
        <button onClick={() => setActiveTab("configureInterfaces")}>Configure Interfaces</button>
        <button onClick={() => setActiveTab("configureRip")}>Configure RIP</button>
      </div>

      <hr />

      <div>
        <label>Router Port: </label>
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(parseInt(e.target.value, 10))}
          style={{ width: "80px", marginBottom: "10px" }}
        />
      </div>

      {activeTab === "showCommand" && (
        <form onSubmit={handleShowCommand}>
          <div>
            <label>Command: </label>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              style={{ width: "300px" }}
            />
          </div>
          <button type="submit">Run Command</button>
          <pre style={{ marginTop: 20, background: "#eee", padding: 10, whiteSpace: "pre-wrap" }}>
            {showOutput}
          </pre>
        </form>
      )}
      {activeTab === "configureInterfaces" && (
        <form onSubmit={handleConfigInterfaces}>
          {interfaces.map((iface, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Interface Name"
                value={iface.name}
                onChange={(e) => updateInterfaceField(idx, "name", e.target.value)}
                style={{ width: "150px", marginRight: 5 }}
              />
              <input
                type="text"
                placeholder="IP Address"
                value={iface.ip}
                onChange={(e) => updateInterfaceField(idx, "ip", e.target.value)}
                style={{ width: "150px", marginRight: 5 }}
              />
              <input
                type="text"
                placeholder="Subnet subnet"
                value={iface.subnet}
                onChange={(e) => updateInterfaceField(idx, "subnet", e.target.value)}
                style={{ width: "150px" }}
              />
            </div>
          ))}
          <button type="button" onClick={addInterface}>
            + Add Interface
          </button>
          <br />
          <button type="submit" style={{ marginTop: 10 }}>
            Configure Interfaces
          </button>
          <pre style={{ marginTop: 20, background: "#eee", padding: 10, whiteSpace: "pre-wrap" }}>
            {configIfOutput}
          </pre>
        </form>
      )}

      {activeTab === "configureRip" && (
        <form onSubmit={handleConfigRip}>
          {networks.map((net, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Network"
                value={net}
                onChange={(e) => updateNetwork(idx, e.target.value)}
                style={{ width: "300px" }}
              />
            </div>
          ))}
          <button type="button" onClick={addNetwork}>
            + Add Network
          </button>
          <br />
          <button type="submit" style={{ marginTop: 10 }}>
            Configure RIP
          </button>
          <pre style={{ marginTop: 20, background: "#eee", padding: 10, whiteSpace: "pre-wrap" }}>
            {configRipOutput}
          </pre>
        </form>
      )}
    </div>
  );
}

export default App;
