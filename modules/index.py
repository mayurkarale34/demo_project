
@app.route('/')
def index():
    print('hello')
    return render_template('index.html')