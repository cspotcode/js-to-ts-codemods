#!/usr/bin/env bash

# run via `yarn transform <name of transformation>`

jscodeshift -t "./transforms/$1.ts"* --stdin < ./source-files.txt
