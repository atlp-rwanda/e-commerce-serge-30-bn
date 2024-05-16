import sendGrid, { MailDataRequired } from '@sendgrid/mail';
import dotenv from 'dotenv';
import fs from 'fs';
import { verificationEmailTemplate } from './EmailTemplates/emailVerificationTemplate';

dotenv.config();
const apiKey = process.env.SENDGRID_API_KEY;


interface EmailOptions<T> {
    to: string | string[];
    from: string;
    subject: string;
    message?: string;
    html?: string;
    template?: (data: T) => string;
    attachmentPath?: string;
    isVerificationEmail?: boolean;
    verificationUrl?: string;
}

const sendEmail = async <T>({
    to,
    from,
    subject,
    message,
    html,
    template,
    attachmentPath,
    isVerificationEmail = false,
    verificationUrl
}:  EmailOptions<T> & { verificationUrl?: string }) => {
    if (!apiKey) {
        console.error('SENDGRID_API_KEY is not defined. Email not sent.');
        return;
    }

    sendGrid.setApiKey(apiKey);
    const messageData: MailDataRequired = {
        to: Array.isArray(to) ? to.join(', ') : to,
        from: from,
        subject: subject,
        content: [{ type: 'text/plain', value: ' ' }] 
    };

    if (message) {
        messageData.text = message;
    }

    if (html) {
        messageData.html = html;
    }

    if (template) {
        const templateData: T = {} as T; 
        const templateContent = template(templateData);
        if (templateContent) {
            messageData.html = templateContent;
        } else {
            console.log('Error: Template function returned undefined');
            return; 
        }
    } else {
        console.log('Error: Template function is not defined');
        return; 
    }

    if (attachmentPath) {
        const attachment = fs.readFileSync(attachmentPath);
        messageData.attachments = [{
            content: attachment.toString('base64'),
            filename: attachmentPath.split('/').pop() || 'attachment'
        }];
    }

    if (isVerificationEmail && verificationUrl) {
        const verificationLink = verificationUrl
        messageData.html = verificationEmailTemplate(verificationLink);

        try {
            await sendGrid.send(messageData);
            console.log('Verification email sent');
        } catch (error) {
            console.log('Error sending verification email:', error);
        }

    } else {
        try {
            await sendGrid.send(messageData);
            console.log('Email sent');
        } catch (error) {
            console.log('Error sending email:', error);
        }
    }
};

export { sendEmail };
