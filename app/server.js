var https = require('https');
var fs =  require('fs');

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  requestCert: false,
  rejectUnauthorized: false
};

var server = https.createServer(options);
server.on('request', doRequest);
server.listen(8443);
console.log('HTTPS Server running!');

function doRequest(req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    console.log('content-type is not application/json:' + req.headers['content-type']);
    return
  }

  if (req.method !== 'POST') {
    console.log('method is not POST:' + req.method);
    return
  }

  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    const requestedAdmissionReview = JSON.parse(body);
    isAllowed = requestedAdmissionReview.request.oldObject.metadata.labels['changeAllowed'] === 'true';

    responseAdmissionReview = {
      'apiVersion': 'admission.k8s.io/v1',
      'kind': 'AdmissionReview',
      'response': {
        'uid': requestedAdmissionReview.request.uid,
        'allowed': isAllowed,
        'status': {
          'message': (isAllowed ? 'Validation succeeded' : 'Validation failed')
        }
      }
    };

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(responseAdmissionReview));
    res.write('\n');
    res.end();
  });
}