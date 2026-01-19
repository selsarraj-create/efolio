const { list } = require('@vercel/blob');

async function testToken() {
    const token = 'vercel_blob_rw_MXdJUIEF0sVkfUjS_SCdAlnVaqzhivHTVMS0OjdU7j5EtYe';
    try {
        console.log('Testing token:', token);
        const { blobs } = await list({ token });
        console.log('Success! Found', blobs.length, 'blobs.');
    } catch (error) {
        console.error('Token validation failed:', error.message);
    }
}

testToken();
