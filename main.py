

import configparser
def integrate():
    try:
        # open file in the read mode
        fin = open("modules/app_init.py", "r")
        # read file content
        app_init = fin.read()
        # close file after read
        fin.close()

        # open file in the read mode
        fin = open("modules/app_run.py", "r")
        # read file content
        app_run = fin.read()
        # close file after read
        fin.close()

        # open file in the read mode
        fin = open("modules/index.py", "r")
        # read file content
        index = fin.read()
        # close file after read
        fin.close()

        combine_file = app_init + index + app_run

        # Created new app file to run the app
        fout = open("demo.py", 'w')
        fout.write(combine_file)
        fout.close()

    except Exception as e:
        print(f"Exception in integrating code = {e}")
        raise Exception("Exception in integrating code")
    
# ==============================================================================  

try:
    # Create object of Config Parser class which is available in configparser module
    config_object = configparser.ConfigParser()
    config_object.read("default_config.ini")

    with open('config.py', 'w') as f:
        # Read DEFAULT section from the Default_config.ini
        for key in config_object['DEFAULT']:
            # Write each line in config.py file
            f.write(f"{key.upper()} = {config_object['DEFAULT'][key]}\n")

    integrate()
except Exception as e:
    print(f"Exception Occured = {e}")