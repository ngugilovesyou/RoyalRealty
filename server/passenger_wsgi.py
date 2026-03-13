# import sys
# import os
# import logging

# # Set up logging to file for debugging
# log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'passenger_wsgi_error.log')
# logging.basicConfig(filename=log_file, level=logging.DEBUG)

# project_home = os.path.dirname(os.path.abspath(__file__))
# if project_home not in sys.path:
#     sys.path.insert(0, project_home)

# logging.debug(f"Project home: {project_home}")
# logging.debug(f"Python path: {sys.path}")
# logging.debug(f"Current directory: {os.getcwd()}")

# try:
#     # Load your app
#     from server import app as application
#     logging.debug("App imported successfully")
    
#     # Log registered routes
#     with application.app_context():
#         routes = [str(rule) for rule in application.url_map.iter_rules()]
#         logging.debug(f"Registered routes: {routes}")
        
# except Exception as e:
#     logging.error(f"Error importing app: {str(e)}")
#     raise

import sys
import os

project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Load your app
from server import app

# Passenger expects 'application' - this is the key line!
application = app