from flask import Flask
from flask import render_template
from flask import send_from_directory
from flask import request
import mmos

app = Flask(__name__)
m = mmos.Client()


def template(name, **context):
    return render_template(name, config=app.config, **context)


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


if __name__ == '__main__':
    app.run()
