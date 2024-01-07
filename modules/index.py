
@app.route('/')
def index():
    print('hello')
    return render_template('index.html')

@app.route('/add_user', methods = ['POST'])
def add_user():
    connection = app._engine.connect()
    transaction = connection.begin()
    request_data = dict(request.form)
    sql_query = text(f"insert into tb_user_details(first_name, last_name, city_name, blood_group) values('{request_data['first_name']}', '{request_data['last_name']}', '{request_data['city_name']}', '{request_data['blood_group']}')")

    connection.execute(sql_query)
    transaction.commit()
    connection.close()


    print("user added successfully")
    return redirect('/')
