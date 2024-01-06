from flask import Flask, render_template

from sqlalchemy import create_engine

from config import DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOSTNAME, DATABASE_NAME


def init_engine(app):
    app._engine = create_engine('mysql://' + DATABASE_USERNAME + ':' + DATABASE_PASSWORD + '@' + DATABASE_HOSTNAME + '/' + DATABASE_NAME + '?charset=utf8', echo = False, pool_size = 50, max_overflow = 16, pool_recycle = 300)

app = Flask(__name__)
app.debug = True
init_engine(app)
@app.route('/')
def index():
    print('hello')
    return render_template('index.html')
app.run(port = 5000)

