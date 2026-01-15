#!/bin/bash
# https://docs.docker.com/build/building/multi-platform/
docker buildx build --platform=linux/amd64,linux/arm64 --push -t hlint/knowlink:dev .