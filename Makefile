BIN=node_modules/.bin
DIST=dist
BUCKET=<<<BUCKET NAME>>>

all: build

cert:
	openssl req -x509 -newkey rsa:4096 -keyout config/certs/key.pem -out config/certs/cert.pem -days 3650 -nodes

clean:
	@rm -rf $(DIST)/*

build: clean
	@NODE_ENV=production node -r babel-register $(BIN)/webpack --progress --color --optimize-minimize

compress: build
	@ls $(DIST)/* | while read -r file; do \
		echo "Compressing $$file"; \
		gzip -9 -c "$$file" > "$$file.gz"; \
		mv "$$file.gz" "$$file"; \
	done

deploy: compress
	cd $(DIST) && s3cmd put \
		--access_key=$(AWS_ACCESS_KEY_ID) \
		--secret_key=$(AWS_SECRET_ACCESS_KEY) \
		--acl-public \
		--add-header "Content-Encoding: gzip" \
		--recursive . \
		s3://$(BUCKET)/
