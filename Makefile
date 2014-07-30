REPORTER = dot

test:
	  @NODE_ENV=test ./node_modules/.bin/mocha \
	        --reporter $(REPORTER) \
	        --ui tdd

style:
		jshint server.js test/* models/* api/*

.PHONY: test style
