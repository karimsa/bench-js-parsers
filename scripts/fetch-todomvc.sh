#!/bin/bash -ex
set -o pipefail

REF="1a59525"

rm -rf todomvc tastejs-todomvc-${REF}
curl -fsSL https://api.github.com/repos/tastejs/todomvc/tarball/ | \
	tar xv --exclude node_modules tastejs-todomvc-${REF}/examples/react

mv tastejs-todomvc-${REF} todomvc
