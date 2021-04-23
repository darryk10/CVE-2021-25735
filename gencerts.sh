
# CA key and certificate
openssl req -new -x509 -nodes -subj '/CN=Validation Controller Webhook' -keyout ca.key -out ca.crt 
# server key
openssl genrsa -out server.key 2048
# CSR
openssl req -new -key server.key -subj '/CN=validationwebhook.validationwebhook.svc' -out server.csr
# server certificate
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt 

# copy certs to app folder
chmod 644 *.key
cp ca.crt ./app
cp server.crt ./app
cp server.key ./app
