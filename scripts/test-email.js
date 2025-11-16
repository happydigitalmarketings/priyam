#!/usr/bin/env node
/**
 * Quick SMTP test script to verify Gmail credentials
 * Usage: node scripts/test-email.js
 * 
 * Make sure .env.local has SMTP_* variables set first
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('\n--- Testing Gmail SMTP Credentials ---\n');
  
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('❌ Error: SMTP_USER or SMTP_PASS not set in .env.local');
    process.exit(1);
  }

  console.log(`Host: ${SMTP_HOST}`);
  console.log(`Port: ${SMTP_PORT}`);
  console.log(`Secure: ${SMTP_SECURE}`);
  console.log(`User: ${SMTP_USER}`);
  console.log(`From: ${FROM_EMAIL}\n`);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.gmail.com',
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully!\n');
  } catch (err) {
    console.error('❌ Transporter verification failed:');
    console.error(err && err.message ? err.message : err);
    console.error('\n⚠️  Make sure:');
    console.error('   1. You created an App Password (not your regular Gmail password)');
    console.error('   2. 2-Step Verification is enabled on your Gmail account');
    console.error('   3. SMTP_USER and SMTP_PASS are correct in .env.local');
    process.exit(1);
  }

  try {
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: SMTP_USER,
      subject: '🧪 Minikki Test Email',
      text: 'This is a test email from your Minikki store to verify Gmail SMTP is working.',
      html: '<p>This is a <strong>test email</strong> from your Minikki store.</p><p>✅ Gmail SMTP is working!</p>',
    });

    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}\n`);

    if (nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.error('❌ Failed to send email:');
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}

testEmail().catch(console.error);
