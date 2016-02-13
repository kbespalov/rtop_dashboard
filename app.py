import json
from flask import Flask, render_template, request
import context as ctx
from metrics import view_builder

app = Flask(__name__)


@app.route('/api/start', methods=['POST'])
def connect():
    content = request.get_json(silent=True)
    print(content)
    ctx.context.create_mq(content['url'], 'rtop')
    return 'In progress...'


@app.route('/api/state')
def state():
    return json.dumps({'state': 1 if ctx.context.is_ready() else 0})


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/api/metrics')
def met():
    return json.dumps(view_builder.build_view(ctx.context.instances_stat))


if __name__ == '__main__':
    app.run(debug=True)
