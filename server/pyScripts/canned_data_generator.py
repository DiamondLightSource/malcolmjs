import json
import shutil
from tornado.websocket import websocket_connect
from tornado import gen, options
from tornado.ioloop import IOLoop

from collections import OrderedDict
from malcolm.core import Queue, Process
from cothread import Spawn, Yield
from commands import getstatusoutput
from filestring_utils import *


class MalcolmServerConnect:
    def __init__(self, socket):
        self.socket = socket
        self.conn = None
        self.status = ""
        self.responses = Queue()
        self._loop = IOLoop()

    def connect(self):
        self.conn = Spawn(self._loop.start)

    @gen.coroutine
    def send_message(self, req, convert_json=True):
        conn = yield websocket_connect("ws://localhost:%s/ws" % self.socket)
        if convert_json:
            req = json.dumps(req)
        conn.write_message(req)
        resp = yield conn.read_message()
        resp = json.loads(resp)
        self.responses.put(resp)
        conn.close()
        Yield()

    def do_task(self, task, *args):
        self._loop.add_callback(task, *args)
        return

    def disconnect(self):
        self._loop.add_callback(self._loop.close())
        self.conn = None


class BashMalcolmServerConnect:
    """ uses system call wscat to talk to pymalcolm server via websocket """
    def __init__(self, socket):
        self.socket = socket
        self.status = ""
        self.responses = Queue()

    def connect(self):
        pass

    def send_message(self, req, convert_json=True):
        if convert_json:
            req = json.dumps(req)
        print req
        [self.status, resp] = getstatusoutput("wscat -c localhost:%s/ws -x '%s'" % (self.socket, req))
        resp = json.loads(resp)
        self.responses.put(resp)

    def do_task(self, task, *args):
        task(*args)

    def disconnect(self):
        pass


def main():
    options.parse_command_line()
    msg = OrderedDict()
    msg['typeid'] = "malcolm:core/Subscribe:1.0"
    msg['id'] = 0
    msg['path'] = [""]
    msg['delta'] = True

    blocks_to_query = ["PANDA", "PANDA:TTLIN1", "PANDA:INENC1", "PANDA:LUT1", "PANDA:SEQ1"]

    try:
        SimServer = MalcolmServerConnect(8008)
        SimServer.connect()
    except Exception as e:
        raise Exception('%s (Have you started the simulator + pymalcolm server?' % e)

    try:
        shutil.rmtree('../canned_data')
    except OSError as e:
        if e == "[Errno 2] No such file or directory: '../canned_data'":
            pass

    print "Getting blocks..."
    msg['path'] = (".", "blocks")
    block_path = ".blocks"
    mkdir_p('../canned_data/Sub/%s' % block_path)
    write_lines_to_file('../canned_data/Sub/%s/request_info.json' % block_path,
                        json.dumps(msg, indent=2))
    SimServer.do_task(SimServer.send_message, msg)
    block_meta = SimServer.responses.get(timeout=2)
    print json.dumps(block_meta)
    write_lines_to_file('../canned_data/Sub/%s/response_info.json' % block_path,
                        json.dumps(block_meta, indent=2))

    for block in blocks_to_query:
        print "Getting %s meta..." % block
        msg['id'] += 1
        msg['path'] = (block, "meta")
        block_path = '/'.join(block.split(':'))
        mkdir_p('../canned_data/Sub/%s' % block_path)
        write_lines_to_file('../canned_data/Sub/%s/request_meta.json' % block_path,
                            json.dumps(msg, indent=2))
        SimServer.do_task(SimServer.send_message, msg)
        block_meta = SimServer.responses.get(timeout=2)
        print json.dumps(block_meta)
        write_lines_to_file('../canned_data/Sub/%s/response_meta.json' % block_path,
                            json.dumps(block_meta, indent=2))
        for field in block_meta["changes"][0][1]["fields"]:
            msg['id'] += 1
            msg['path'] = (block, field)
            write_lines_to_file('../canned_data/Sub/%s/request_%s.json' % (block_path, field),
                                json.dumps(msg, indent=2))
            SimServer.do_task(SimServer.send_message, msg)
            block_field = SimServer.responses.get(timeout=2)
            print json.dumps(block_field)
            write_lines_to_file('../canned_data/Sub/%s/response_%s.json' % (block_path, field),
                                json.dumps(block_field, indent=2))

    SimServer.disconnect()


if __name__ == "__main__":
    main()

