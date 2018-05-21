import json
import shutil
from tornado.websocket import websocket_connect
from tornado import gen, options
from tornado.ioloop import IOLoop
from collections import OrderedDict
from malcolm.core import Queue
from commands import getstatusoutput
from filestring_utils import write_lines_to_file, mkdir_p


class MalcolmServerConnect:
    def __init__(self, socket):
        self.msg_id = -1
        self.socket = socket
        self.message = None
        self.status = ""
        self.responses = Queue()
        self._loop = IOLoop()

    @gen.coroutine
    def message_coroutine(self):
        conn = yield websocket_connect("ws://localhost:%s/ws" % self.socket)
        msg = json.dumps(self.message)
        conn.write_message(msg)
        resp = yield conn.read_message()
        resp = json.loads(resp)
        self.responses.put(resp)
        conn.close()

    def send_subscribe(self, path):
        self.msg_id += 1
        msg = OrderedDict()
        msg['typeid'] = "malcolm:core/Subscribe:1.0"
        msg['id'] = self.msg_id
        msg['path'] = path
        msg['delta'] = True
        self.message = msg
        self._loop.run_sync(self.message_coroutine)


def main():
    blocks_to_query = ["PANDA", "PANDA:TTLIN1", "PANDA:INENC1", "PANDA:LUT1", "PANDA:SEQ1"]
    try:
        SimServer = MalcolmServerConnect(8008)
    except Exception as e:
        raise Exception('%s (Have you started the simulator + pymalcolm server?' % e)

    try:
        shutil.rmtree('../canned_data')
    except OSError as e:
        if e == "[Errno 2] No such file or directory: '../canned_data'":
            pass

    print "Getting blocks..."
    block_path = ".blocks"
    mkdir_p('../canned_data/Sub/%s' % block_path)
    SimServer.send_subscribe((".", "blocks"))
    write_lines_to_file('../canned_data/Sub/%s/request_info.json' % block_path,
                        json.dumps(SimServer.message, indent=2))
    block_meta = SimServer.responses.get(timeout=2)
    block_meta['id'] = "CANNED"
    write_lines_to_file('../canned_data/Sub/%s/response_info.json' % block_path,
                        json.dumps(block_meta, indent=2))

    for block in blocks_to_query:
        print "Getting %s meta..." % block
        block_path = '/'.join(block.split(':'))
        mkdir_p('../canned_data/Sub/%s' % block_path)
        SimServer.send_subscribe((block, "meta"))
        write_lines_to_file('../canned_data/Sub/%s/request_meta.json' % block_path,
                            json.dumps(SimServer.message, indent=2))
        block_meta = SimServer.responses.get(timeout=2)
        block_meta['id'] = "CANNED"
        write_lines_to_file('../canned_data/Sub/%s/response_meta.json' % block_path,
                            json.dumps(block_meta, indent=2))
        print "...Getting %s fields for %s..." % (len(block_meta["changes"][0][1]["fields"]), block)
        for field in block_meta["changes"][0][1]["fields"]:
            SimServer.send_subscribe((block, field))
            write_lines_to_file('../canned_data/Sub/%s/request_%s.json' % (block_path, field),
                                json.dumps(SimServer.message, indent=2))
            block_field = SimServer.responses.get(timeout=2)
            block_field['id'] = "CANNED"

            if 'timeStamp' in block_field['changes'][0][1].keys():
                block_field['changes'][0][1]['timeStamp']['secondsPastEpoch'] = 0
                block_field['changes'][0][1]['timeStamp']['nanoseconds'] = 0

            write_lines_to_file('../canned_data/Sub/%s/response_%s.json' % (block_path, field),
                                json.dumps(block_field, indent=2))


if __name__ == "__main__":
    main()

