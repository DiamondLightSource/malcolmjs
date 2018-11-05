import json
import shutil
import os
from collections import OrderedDict

from tornado.websocket import websocket_connect
from tornado import gen, options
from tornado.ioloop import IOLoop

from filestring_utils import write_lines_to_file, mkdir_p


class MalcolmServerConnect:
    def __init__(self, socket):
        self.socket = socket
        self.request = None
        self.response = None
        self._loop = IOLoop()

    @gen.coroutine
    def message_coroutine(self):
        conn = yield websocket_connect("ws://localhost:%s/ws" % self.socket)
        msg = json.dumps(self.request)
        conn.write_message(msg)
        resp = yield conn.read_message()
        self.response = json.loads(resp, object_pairs_hook=OrderedDict)
        conn.close()

    def send_subscribe(self, path, delta):
        self.request = OrderedDict()
        self.request['typeid'] = "malcolm:core/Subscribe:1.0"
        self.request['id'] = "CANNED"
        self.request['path'] = path
        self.request['delta'] = delta
        self._loop.run_sync(self.message_coroutine)
        if delta:
            for change in self.response['changes']:
                if len(change) == 2 and isinstance(change[1], dict) and \
                        "timeStamp" in change[1]:
                    for endpoint in ("secondsPastEpoch", "nanoseconds"):
                        change[1]['timeStamp'][endpoint] = 0

    def subscribe_request_response(self, path, delta=True):
        self.send_subscribe(path, delta)
        request_msg = json.dumps(self.request, indent=2)
        response_msg = json.dumps(self.response, indent=2)
        return request_msg, response_msg


def main(get_all_blocks):
    try:
        SimServer = MalcolmServerConnect(8008)
    except Exception as e:
        raise Exception(
                '%s (Have you started the simulator + pymalcolm server?' % e)

    canned_data = os.path.join(os.path.dirname(__file__), "..", "canned_data")
    if os.path.exists(canned_data):
        shutil.rmtree(canned_data)

    print "Getting blocks..."
    mkdir_p('%(canned_data)s/Sub/blocks' % locals())
    request, response = SimServer.subscribe_request_response(
            (".", "blocks"), delta=False)
    write_lines_to_file(
            '%(canned_data)s/Sub/blocks/request_info.json' % locals(),
            request)
    write_lines_to_file(
            '%(canned_data)s/Sub/blocks/response_info.json' % locals(),
            response)

    if get_all_blocks:
        blocks_to_query = SimServer.response["value"]
    else:
        blocks_to_query = ["PANDA", "PANDA:TTLIN1", "PANDA:INENC1",
                           "PANDA:LUT1", "PANDA:SEQ1"]

    for block in blocks_to_query:
        print "Getting %s meta..." % block
        block_path = '/'.join(block.split(':'))
        mkdir_p('%(canned_data)s/Sub/%(block_path)s' % locals())
        request, response = \
                SimServer.subscribe_request_response((block, "meta"))
        write_lines_to_file(
                '%(canned_data)s/Sub/%(block_path)s/request_meta.json'
                        % locals(), request)
        write_lines_to_file(
                '%(canned_data)s/Sub/%(block_path)s/response_meta.json'
                        % locals(), response)
        block_meta = SimServer.response["changes"][0][1]
        print "...Getting %s fields for %s..." % (
                len(block_meta["fields"]), block)
        for field in block_meta["fields"]:
            request, response = \
                    SimServer.subscribe_request_response((block, field))
            write_lines_to_file(
                    '%(canned_data)s/Sub/%(block_path)s/'
                            'request_%(field)s.json' % locals(), request)
            write_lines_to_file(
                    '%(canned_data)s/Sub/%(block_path)s/' \
                            'response_%(field)s.json' % locals(), response)


if __name__ == "__main__":
    main(True)

