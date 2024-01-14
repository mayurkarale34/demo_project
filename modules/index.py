
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

@app.route('/retrive_users', methods = ['GET', 'POST'])
def retrive_users():
    response = {
        "rows" : [],
        "total" : 0
    }
    city = request.args.get('city')
    
    result = app._engine.connect().execute(text(f"select * from tb_user_details where city_name = if('{city}' = 'All', city_name, '{city}')"))
    if result.rowcount:
        for row in result:
            columns = result.keys()
            row_dict = dict(zip(columns, row))
            response['rows'].append(row_dict)

        response['total'] = len(response['rows'])

    return jsonify(response)

@app.route('/delete_user', methods = ['POST'])
def delete_user():
    connection = app._engine.connect()
    transaction = connection.begin()
    data = dict(request.get_json())
    id = data['user_id']
    delete_query = text(f"delete from tb_user_details where id = '{id}'")
    connection.execute(delete_query)
    transaction.commit()
    connection.close()
    return jsonify("User deleted successfully...")