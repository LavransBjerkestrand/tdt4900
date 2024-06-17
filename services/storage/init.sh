#!/bin/bash

alias mc=/usr/bin/mc

mc alias set myminio http://storage:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD
mc mb myminio/$BUCKET_NAME_GRADERS
mc mb myminio/$BUCKET_NAME_SUBMISSIONS
# TODO: buckets shouldn't be public
mc anonymous set public myminio/$BUCKET_NAME_GRADERS 
mc anonymous set public myminio/$BUCKET_NAME_SUBMISSIONS

# init RabbitMQ event destinations
mc admin config set myminio/ notify_amqp:graders \
    url="amqp://$RABBITMQ_DEFAULT_USER:$RABBITMQ_DEFAULT_PASS@message-queue:5672" \
    exchange="uploads.grader.x" \
    exchange_type="direct" \
    mandatory="on" \
    durable="on" \
    delivery_mode="2"

mc admin config set myminio/ notify_amqp:submissions \
    url="amqp://$RABBITMQ_DEFAULT_USER:$RABBITMQ_DEFAULT_PASS@message-queue:5672" \
    exchange="uploads.submission.x" \
    exchange_type="direct" \
    mandatory="on" \
    durable="on" \
    delivery_mode="2"

# restart minio to apply changes
mc admin service restart myminio

# init MinIO bucket events
mc event add myminio/$BUCKET_NAME_GRADERS arn:minio:sqs::graders:amqp --event put
mc event add myminio/$BUCKET_NAME_SUBMISSIONS arn:minio:sqs::submissions:amqp --event put


exit 0