from netmiko import ConnectHandler

def connect_to_router(port):
    device = {
        'device_type': 'cisco_ios_telnet',  
        'host': '127.0.0.1',
        'port': port,
        'username': 'cisco',
        'password': 'cisco',
        'secret': 'cisco',
    }
    try:
        conn = ConnectHandler(**device)
        conn.enable()  
        return conn
    except Exception as e:
        print(f"Connection error on port {port}: {e}")
        return None

def configure_interfaces(port, interfaces):
    conn = connect_to_router(port)
    if not conn:
        return "port error"

    commands = []
    for interface in interfaces:
        commands.extend([
            f"interface {interface['name']}",
            f"ip address {interface['ip']} {interface['subnet']}",
            "no shutdown"
        ])
    print("Commands to send:", commands)  

    try:
        output = conn.send_config_set(commands)
        conn.disconnect()
        return output
    except Exception as e:
        return f"Error configuring interfaces: {e}"

def configure_rip(port, networks):
    conn = connect_to_router(port)
    if not conn:
        return "port not found"

    commands = ["router rip"]
    commands.extend([f"network {net}" for net in networks])
    print("Commands to send:", commands) 

    try:
        output = conn.send_config_set(commands)
        conn.disconnect()
        return output
    except Exception as e:
        return f"Error configuring RIP: {e}"

def show_command(port, command):
    conn = connect_to_router(port)
    if not conn:
        return "port not found"

    try:
        output = conn.send_command(command)
        conn.disconnect()
        return output
    except Exception as e:
        return f"Error executing show command: {e}"


