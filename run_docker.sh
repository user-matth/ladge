#!/bin/bash
# Build the Docker image
docker build -t ladge .
# Run the Docker container
docker run -d -p 4200:4200 ladge
