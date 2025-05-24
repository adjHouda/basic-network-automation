from flask import Flask, request, jsonify
from flask_cors import CORS
from netmiko_util import configure_interfaces, configure_rip, show_command

app = Flask(__name__)
CORS(app) 

@app.route('/configure-interfaces', methods=['POST'])
def api_configure_interfaces():
    data = request.json
    print("received data", data)
    port = data.get('routerPort')
    interfaces = data.get('interfaces')
    output = configure_interfaces(port, interfaces)
    return jsonify({'output': output})

@app.route('/configure-rip', methods=['POST'])
def api_configure_rip():
    data = request.json
    port = data.get('routerPort')
    networks = data.get('networks')
    output = configure_rip(port, networks)
    return jsonify({'output': output})
    

@app.route('/show-command', methods=['POST'])
def api_show():
    data = request.json
    port = data.get('routerPort')
    command = data.get('command')
    output = show_command(port, command)
    return jsonify({'output': output})

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080, debug=True)
