#!/usr/bin/env python3

import requests
import json
import logging
from http.server import BaseHTTPRequestHandler, HTTPServer
from requests.auth import HTTPBasicAuth
from time import time

base_api_url = "http://localhost:8080" #API base url
submission_url = "{}/submission".format(base_api_url) #API endpoint to retrieve submission information
token_url = "{}/token".format(base_api_url) #API endpoint to get tokens

credentials = ("<service_id>", "<service_secret>") #These are issued when a service is registered

exp_buffer = 20 #Seconds to subtract from expiration for a safety buffer

class MessageRequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args):
        self.access_token = False
        self.refresh_token = False
        self.token_exp = 0
        BaseHTTPRequestHandler.__init__(self, *args)

    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n", str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(self.path).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        body = json.loads(post_data.decode('utf-8'))
        message_type = body.get("Type", "none")
        if message_type == "none":
            pass
        elif message_type == "Notification":
            self.handle_notification(body)
        elif message_type == "SubscriptionConfirmation":
            self.handle_subscription_confirmation(body)
        self._set_response()
        self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))

    def handle_notification(self, body):
        message = json.loads(body.get("Message"))
        if message:
            logging.info(message)
            submission_id = message.get("submission_id")
            if time() > self.token_exp:
                self.get_token(refresh=self.refresh_token)
            if submission_id:
                endpoint = "{}/{}".format(submission_url, submission_id)
                requests.get(endpoint, auth=BearerAuth(self.access_token))
                r = requests.get(endpoint)
                submission = json.loads(r.text)
                # Do something with the data
                # Here is where you write your code to interact with your on-prem system, or log the data, etc.
                logging.info(submission)

    def get_token(self, refresh=False):
        params = { "refresh": refresh } if refresh else {}
        r = requests.get(token_url, auth=credentials, params=params)
        tokens = json.loads(r.text)
        self.access_token = tokens.access_token
        self.refresh_token = tokens.refresh_token
        self.token_exp = int(tokens.expires_in) + int(time()) - exp_buffer

    def handle_subscription_confirmation(self, body):
        subscribe_url = body.get("SubscribeURL")
        if subscribe_url:
            r = requests.get(subscribe_url)
            logging.info(r.text)

class BearerAuth(requests.auth.AuthBase):
    def __init__(self, token):
        self.token = token
    def __call__(self, r):
        r.headers["authorization"] = "Bearer " + self.token
        return r

def run(server_class=HTTPServer, handler_class=MessageRequestHandler, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')

if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
