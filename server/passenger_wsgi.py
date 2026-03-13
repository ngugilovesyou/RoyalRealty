# # import sys
# # import os
# # import logging

# # # Set up logging to file for debugging
# # log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'passenger_wsgi_error.log')
# # logging.basicConfig(filename=log_file, level=logging.DEBUG)

# # project_home = os.path.dirname(os.path.abspath(__file__))
# # if project_home not in sys.path:
# #     sys.path.insert(0, project_home)

# # logging.debug(f"Project home: {project_home}")
# # logging.debug(f"Python path: {sys.path}")
# # logging.debug(f"Current directory: {os.getcwd()}")

# # try:
# #     # Load your app
# #     from server import app as application
# #     logging.debug("App imported successfully")
    
# #     # Log registered routes
# #     with application.app_context():
# #         routes = [str(rule) for rule in application.url_map.iter_rules()]
# #         logging.debug(f"Registered routes: {routes}")
        
# # except Exception as e:
# #     logging.error(f"Error importing app: {str(e)}")
# #     raise

# import sys
# import os

# project_home = os.path.dirname(os.path.abspath(__file__))
# if project_home not in sys.path:
#     sys.path.insert(0, project_home)

# # Load your app
# from server import app

# # Passenger expects 'application' - this is the key line!
# application = app



import sys
import os
import logging
from logging.handlers import RotatingFileHandler

# Set up logging to file for debugging
log_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'passenger_wsgi_error.log')

# Configure logging with rotation to prevent huge log files
handler = RotatingFileHandler(log_file, maxBytes=1048576, backupCount=3)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Get the root logger and add the handler
root_logger = logging.getLogger()
root_logger.setLevel(logging.DEBUG)
root_logger.addHandler(handler)

# Add project directory to Python path
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

logging.debug(f"Project home: {project_home}")
logging.debug(f"Python path: {sys.path}")
logging.debug(f"Current directory: {os.getcwd()}")

try:
    # Import your app
    from server import app
    
    logging.debug("App imported successfully")
    
    # Log registered routes (if using Flask)
    if hasattr(app, 'url_map'):
        with app.app_context():
            routes = [str(rule) for rule in app.url_map.iter_rules()]
            logging.debug(f"Registered routes: {routes}")
    
    # Passenger expects 'application' - this is the key line!
    application = app
    
    logging.debug("WSGI application initialized successfully")
    
except ImportError as e:
    logging.error(f"Import error: {str(e)}")
    # Try alternative import paths if needed
    try:
        # Sometimes the app might be in a different module
        sys.path.insert(0, os.path.join(project_home, 'your_app_directory'))
        from your_app_module import app as application
        logging.debug("App imported from alternative path")
    except Exception as e2:
        logging.error(f"Alternative import also failed: {str(e2)}")
        raise
except Exception as e:
    logging.error(f"Error initializing WSGI application: {str(e)}")
    raise

# Optional: Add middleware if needed
# from werkzeug.middleware.profiler import ProfilerMiddleware
# application = ProfilerMiddleware(application)

# Optional: Add error handling middleware
class ErrorHandlingMiddleware:
    def __init__(self, app):
        self.app = app
    
    def __call__(self, environ, start_response):
        try:
            return self.app(environ, start_response)
        except Exception as e:
            logging.error(f"Unhandled exception in request: {str(e)}")
            start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
            return [b'Internal Server Error']

# Uncomment to add error handling middleware
# application = ErrorHandlingMiddleware(application)