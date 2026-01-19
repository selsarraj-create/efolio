import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientConfig } from '@/lib/client-config';
import { getModelConfig } from '@/lib/config';

// Initialize Resend with the key provided by the user
// Ideally this should be process.env.RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || 're_M1DaTgHg_CYnydPciMz6Q1ajRJXYmVjhY');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clientSlug, name, email, subject, message } = body;

        let recipientEmail = '';

        if (clientSlug && clientSlug !== 'main') {
            const config = await getClientConfig(clientSlug);
            if (config && config.personalInfo?.email) {
                recipientEmail = config.personalInfo.email;
            }
        } else {
            const config = await getModelConfig();
            recipientEmail = config.personalInfo.email;
        }

        if (!recipientEmail) {
            console.error(`No email found for clientSlug: ${clientSlug}`);
            return NextResponse.json({ error: `Configuration Error: No email found for client '${clientSlug}'. Please check Admin settings.` }, { status: 400 });
        }

        const emailSubject = `[Portfolio Inquiry] ${subject || 'New Message'}`;

        const emailBody = `
            <h2>New Message from your Portfolio Contact Form</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
                ${message?.replace(/\n/g, '<br/>')}
            </blockquote>
        `;

        const data = await resend.emails.send({
            from: 'Portfolio Contact <no-reply@mail.edgetalent.co.uk>',
            to: [recipientEmail],
            replyTo: email,
            subject: emailSubject,
            html: emailBody,
        });

        if (data.error) {
            console.error("Resend API Error:", data.error);
            return NextResponse.json({ error: `Resend Error: ${data.error.message}` }, { status: 500 });
        }

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Email sending error:', error);
        return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
    }
}
