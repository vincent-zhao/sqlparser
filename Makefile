
test:
	@npm install mocha 
	@npm install should 
	@./node_modules/mocha/bin/mocha --reporter spec --timeout 5000 test/*Test.js 

cov:
	@/bin/bash build/jscoverage.sh
	@mv lib lib_bak && ./bin/jscoverage lib_bak lib 
	-./node_modules/mocha/bin/mocha --reporter html-cov --timeout 5000 test/*Test.js > coverage.html
	-rm -rf lib && mv lib_bak lib

.PHONY: test
