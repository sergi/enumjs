test:
	npm test

coverage:
	-jscoverage --no-highlight lib lib-cov
	-env VFS_FTP_COV=1 mocha -R html-cov > coverage.html
	rm -rf lib-cov

.PHONY: test
