from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/process", methods=["POST"])
def process_data():
    content = request.get_json()
    data = content.get("data", [])
    callback_url = content.get("callbackUrl")

    # Simulate processing (e.g., count items)
    result = {
        "original_count": len(data),
        "names_uppercase": [entry["first_name"].upper() for entry in data]
    }

    # POST result back to the Node.js server
    try:
        res = requests.post(callback_url, json=result)
        print(f"✅ Sent result back to {callback_url} – status {res.status_code}")
    except Exception as e:
        print(f"❌ Failed to callback:", str(e))

    return jsonify({"status": "processing complete"})

if __name__ == "__main__":
    app.run(port=5000)
