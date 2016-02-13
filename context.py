import pickle
import threading
import pika
from  collections import deque


class QContext(object):
    def __init__(self, mq_url, exchange, instances_stats):
        self.instances_stats = instances_stats
        self.ampq_url = mq_url
        self.exchange = exchange
        self.connection = None
        self.channel = None
        self.own_queue = None
        self.ready = False

    def connect(self):
        try:
            self.connection = pika.BlockingConnection(pika.connection.URLParameters(self.ampq_url))
            self.channel = self.connection.channel()
            self.channel.exchange_declare(exchange=self.exchange, exchange_type='fanout')
            self.own_queue = self.channel.queue_declare(exclusive=True)
            self.channel.queue_bind(exchange=self.exchange, queue=self.own_queue.method.queue)
            self.channel.basic_consume(self.on_msg, queue=self.own_queue.method.queue, no_ack=True)
            self.ready = True
            self.channel.start_consuming()
        except Exception as e:
            print e

    def stop(self):
        self.channel.close()

    def on_msg(self, ch, method, properties, body):
        metric = pickle.loads(body)
        name = metric['instance']
        if name not in self.instances_stats:
            self.instances_stats[name] = deque(maxlen=30)
        self.instances_stats[name].append(metric)
        print '+1'


class AppContext(object):
    def __init__(self):
        self.amqp_url = None
        self.mq_context = None
        self.instances_stat = {}

    def create_mq(self, ampq_url, exchange):
        if self.mq_context:
            self.mq_context.stop()
        self.mq_context = QContext(ampq_url, exchange, self.instances_stat)
        threading.Thread(target=self.mq_context.connect).start()

    def is_ready(self):
        if self.mq_context and self.mq_context.ready:
            return True
        return False


context = AppContext()
