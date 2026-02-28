import http from 'http';

const data = JSON.stringify({
  to: 'gayatrikadam1405@gmail.com',
  subject: 'Test Email from Server',
  body: 'This is a test email to verify the email system is working!'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/send-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
