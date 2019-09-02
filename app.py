from flask import Flask
import hashlib
import hmac
import json
import time
import requests
from flask import render_template
import random
from flask import send_from_directory
from flask import request
import os

app = Flask(__name__)


class MMOSAPI:
    def __init__(self):
        self.protocol = "https"
        self.host = "api.depo.mmos.blue"
        self.port = 443
        self.version = "v2"
        self.game = "yvan-le-bras-mnhn-fr"
        self.apiKey = {
            "key": os.environ["MMOS_API_KEY"],
            "secret": os.environ["MMOS_API_SECRET"],
        }

        self.playerCode = "YVAN001"
        self.projectCode = "spipoll-fly"
        self.urlBase = "%s://%s" % (self.protocol, self.host)

    def digest(self, key, data):
        h = hmac.new(bytes(str(key).encode("utf-8")), digestmod=hashlib.sha256)
        h.update(data.encode("utf-8"))
        return h.hexdigest()

    def build_headers(self, method, path, body={}):
        CONTENT_SEPARATOR = "|"
        SIGNING_ALGORITHM = "MMOS1-HMAC-SHA256"
        nonce = random.randint(0, 1000000000)
        timestamp = int(time.time())

        timestamp = 1567416082496
        nonce = 222773350332

        contentParts = [
            SIGNING_ALGORITHM,
            self.apiKey["key"],
            timestamp,
            nonce,
            method,
            path,
            json.dumps(body, separators=(",", ":")),
        ]
        content = CONTENT_SEPARATOR.join(map(str, contentParts))
        print(content)

        signingKey = self.digest(timestamp, self.apiKey["secret"])
        signature = self.digest(signingKey, content)

        return {
            "Content-Type": "application/json",
            "X-MMOS-Algorithm": SIGNING_ALGORITHM,
            "X-MMOS-Credential": self.apiKey["key"],
            "X-MMOS-Timestamp": str(timestamp),
            "X-MMOS-Nonce": str(nonce),
            "X-MMOS-Signature": signature,
        }

    def info(self):
        path = "/"
        body = {}
        headers = self.build_headers("GET", path, body)
        r = requests.get(self.urlBase + path, headers=headers, data=body)
        return r.json()

    def create_task(self):
        path = "/games/%s/players/%s/tasks" % (self.game, self.playerCode)
        body = {
            "projects": [self.projectcode],
            "player": {"accountcode": self.playercode},
        }
        headers = self.build_headers("POST", path, body)
        r = requests.post(self.urlBase + path, headers=headers, json=body)
        return r.json()

    def classify(self, sex, task_created, task_id):
        path = "/classifications"
        body = {
            "task": {"id": task_id, "result": {"gender": sex}},
            "circumstances": {"t": time.time() - int(task_created)},
            "player": {"accountcode": self.playercode},
            "playergroup": "group1122",
        }
        headers = self.build_headers("POST", path, body)
        r = requests.post(self.urlBase + path, headers=headers, json=body)
        return r.json()


m = MMOSAPI()


def template(name, **context):
    return render_template(name, host=request.host, config=app.config, **context)


@app.route("/img/<path:path>")
def send_img(path):
    return send_from_directory("img", path)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        sex = request.values.get("sex")
        task_created = request.values.get("task_created")
        task_id = request.values.get("task_id")

        m.classify(sex, task_created, task_id)

    # t = m.create_task()
    return template("guess.html", t=None)


app.run()
