#!/bin/bash

if [ $? -eq 0 ]; then

    ./a.out "1" "2"

    exit_code=$?

    rm 

    exit $exit_code

