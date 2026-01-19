const { Resend } = require('resend');

const resend = new Resend('re_M1DaTgHg_CYnydPciMz6Q1ajRJXYmVjhY');

async function testSend() {
    try {
        console.log("Attempting to send email from verified subdomain...");
        const data = await resend.emails.send({
            from: 'Portfolio Contact <no-reply@mail.edgetalent.co.uk>',
            to: 'random_test_email@example.com',
            subject: 'Test Email from Mail Subdomain',
            html: '<p>It works from mail.edgetalent.co.uk!</p>'
        });
        console.log("Success:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testSend();
