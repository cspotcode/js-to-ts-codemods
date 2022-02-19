#!/usr/bin/env bash
set -euxo pipefail
shopt -s inherit_errexit

__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$__dirname/.."

temp=test/temp
output=test/output

yarn just run

diff $temp $output
