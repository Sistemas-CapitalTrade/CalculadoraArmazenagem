import logging
from flask import g

# Init logger
logger = logging.getLogger("Logger")


logger.setLevel(logging.INFO)  # Set log level to INFO
logger.propagate = False
file_handler = logging.FileHandler('logs/app.log',encoding='utf-8')  # Log to a file
stream_handler = logging.StreamHandler() # Log to terminal
formatter = logging.Formatter("%(asctime)s--%(name)s--%(levelname)s--%(clientip)s--%(message)s")
file_handler.formatter=formatter
stream_handler.formatter=formatter


logger.addHandler(file_handler)
logger.addHandler(stream_handler)



def logRequest(message, levelName, exc_info = False):
    # Access the client IP from g
    ip_addr = getattr(g, 'client_ip', 'Unknown IP')  # Default to 'Unknown IP' if not set
    cIP = {'clientip': ip_addr}
    logger.log(level=levelName,msg=message,extra=cIP, exc_info=exc_info)

def logInternal(message, levelName):
    # Access the client IP from g
    ip_addr = "Internal server"
    cIP = {'clientip': ip_addr}
    logger.log(level=levelName,msg=message,extra=cIP)