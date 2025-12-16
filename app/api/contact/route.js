import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { rateLimit } from '@/utils/rate-limiter';
import { getClientIP, validateEmail, validateName, validateMessage, sanitizeString } from '@/utils/validation';

// Create and configure Nodemailer transporter
// Use a function to create transporter to avoid connection issues
function createTransporter() {
  const port = parseInt(process.env.SMTP_PORT || '587');
  const isSecure = port === 465;
  const host = process.env.SMTP_HOST || 'mail.kakhki.ir';
  const user = process.env.SMTP_USER || 'contact@kakhki.ir';
  
  console.log('\n🔧 Creating SMTP Transporter...');
  console.log('Configuration:', {
    host,
    port,
    secure: isSecure,
    user,
    requireTLS: !isSecure,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });
  
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: isSecure, // true for 465, false for other ports
    auth: {
      user: user,
      pass: process.env.SMTP_PASSWORD || 'qweOP123!@#?',
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    },
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,
    socketTimeout: 30000,
    // Don't verify connection on creation - verify only when needed
    requireTLS: !isSecure,
    // Retry configuration
    pool: false, // Disable pooling to avoid connection issues
    debug: true, // Enable debug mode
    logger: true, // Enable logging
  });
  
  // Add event listeners for debugging
  transporter.on('token', (token) => {
    console.log('📧 SMTP Token event:', token);
  });
  
  return transporter;
}

// Create transporter instance
let transporter = createTransporter();

// Helper function to send a message via Telegram
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
};

// HTML email template with XSS protection
const generateEmailTemplate = (name, email, userMessage) => {
  // Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };
  
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(userMessage).replace(/\n/g, '<br>');
  
  return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #007BFF;">New Message Received</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
          ${safeMessage}
        </blockquote>
        <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
      </div>
    </div>
  `;
};

// Helper function to send an email via Nodemailer
async function sendEmail(payload, message) {
  const { name, email, message: userMessage } = payload;
  
  const smtpHost = process.env.SMTP_HOST || 'mail.kakhki.ir';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER || 'contact@kakhki.ir';
  const receivingEmail = process.env.RECEIVING_EMAIL || 'me@kakhki.ir';
  
  console.log('=== SMTP Configuration ===');
  console.log('Host:', smtpHost);
  console.log('Port:', smtpPort);
  console.log('User:', smtpUser);
  console.log('Secure:', smtpPort === 465);
  console.log('To:', receivingEmail);
  console.log('==========================');
  
  const mailOptions = {
    from: `"Portfolio Contact" <${smtpUser}>`, 
    to: receivingEmail, 
    subject: `New Message From ${name}`, 
    text: message, 
    html: generateEmailTemplate(name, email, userMessage), 
    replyTo: email,
    // Security headers
    headers: {
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
    }
  };
  
  // Try sending with timeout and retry logic
  const maxRetries = 2;
  let lastError = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const attemptStartTime = Date.now();
    console.log(`\n--- Email Send Attempt ${attempt + 1}/${maxRetries} ---`);
    console.log('Timestamp:', new Date().toISOString());
    
    try {
      // Create a new transporter for each attempt to avoid stale connections
      if (attempt > 0) {
        console.log('Creating new transporter for retry...');
        transporter = createTransporter();
        // Small delay before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Ensure transporter is created for first attempt
      if (attempt === 0) {
        console.log('Creating initial transporter...');
        transporter = createTransporter();
      }
      
      // Try to verify connection first (with detailed logging)
      console.log('🔍 Attempting SMTP connection verification...');
      console.log('Connecting to:', smtpHost + ':' + smtpPort);
      const verifyStartTime = Date.now();
      try {
        console.log('Starting verify() call at', new Date().toISOString());
        
        const verifyResult = await Promise.race([
          transporter.verify(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Verify timeout after 15 seconds')), 15000))
        ]);
        
        const verifyDuration = Date.now() - verifyStartTime;
        console.log(`✅ Connection verified successfully! (${verifyDuration}ms)`);
        console.log('Verify result:', verifyResult);
      } catch (verifyError) {
        const verifyDuration = Date.now() - verifyStartTime;
        console.error(`❌ Connection verification failed after ${verifyDuration}ms`);
        console.error('Error Type:', verifyError.constructor.name);
        console.error('Error Code:', verifyError.code);
        console.error('Error Number:', verifyError.errno);
        console.error('System Call:', verifyError.syscall);
        console.error('Address:', verifyError.address);
        console.error('Port:', verifyError.port);
        console.error('Error Message:', verifyError.message);
        console.error('Full Error Object:', JSON.stringify({
          name: verifyError.name,
          message: verifyError.message,
          code: verifyError.code,
          errno: verifyError.errno,
          syscall: verifyError.syscall,
          address: verifyError.address,
          port: verifyError.port
        }, null, 2));
        
        if (verifyError.stack) {
          console.error('Stack Trace (first 10 lines):');
          console.error(verifyError.stack.split('\n').slice(0, 10).join('\n'));
        }
        
        // If verify fails, try to recreate transporter
        if (attempt < maxRetries - 1) {
          console.log('🔄 Recreating transporter after verification failure...');
          transporter = createTransporter();
          continue;
        } else {
          console.error('⚠️  Skipping email send - connection verification failed on all attempts');
          throw verifyError;
        }
      }
      
      // Send email with timeout
      console.log('📧 Sending email...');
      console.log('Mail Options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasText: !!mailOptions.text,
        hasHtml: !!mailOptions.html
      });
      
      const sendStartTime = Date.now();
      console.log('Calling sendMail() at', new Date().toISOString());
      
      const sendPromise = transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => {
          console.error('⏱️  SendMail timeout triggered after 25 seconds');
          reject(new Error('SMTP send timeout after 25 seconds'));
        }, 25000)
      );
      
      const info = await Promise.race([sendPromise, timeoutPromise]);
      const sendDuration = Date.now() - sendStartTime;
      const totalDuration = Date.now() - attemptStartTime;
      
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', info.messageId);
      console.log('Accepted:', info.accepted);
      console.log('Rejected:', info.rejected);
      console.log('Pending:', info.pending);
      console.log('Response:', info.response);
      console.log('Send duration:', sendDuration + 'ms');
      console.log('Total attempt duration:', totalDuration + 'ms');
      return true;
      
    } catch (error) {
      lastError = error;
      const attemptDuration = Date.now() - attemptStartTime;
      
      console.error(`\n❌ Email send attempt ${attempt + 1} failed after ${attemptDuration}ms`);
      console.error('═══════════════════════════════════════════════════════════');
      console.error('ERROR DETAILS:');
      console.error('═══════════════════════════════════════════════════════════');
      console.error('Error Name:', error.name);
      console.error('Error Code:', error.code);
      console.error('Error Number:', error.errno);
      console.error('System Call:', error.syscall);
      console.error('Address:', error.address);
      console.error('Port:', error.port);
      console.error('Command:', error.command);
      console.error('Response Code:', error.responseCode);
      console.error('Response:', error.response);
      console.error('Error Message:', error.message);
      console.error('═══════════════════════════════════════════════════════════');
      
      if (error.stack) {
        console.error('STACK TRACE:');
        console.error(error.stack);
      }
      
      if (error.response) {
        console.error('SMTP SERVER RESPONSE:');
        console.error(error.response);
      }
      
      if (error.command) {
        console.error('LAST SMTP COMMAND:', error.command);
      }
      
      console.error('═══════════════════════════════════════════════════════════\n');
      
      // Handle specific error codes with detailed messages
      if (error.code === 'EAUTH') {
        console.error('\n❌ SMTP AUTHENTICATION FAILED');
        console.error('Possible causes:');
        console.error('  1. Incorrect username or password in .env file');
        console.error('  2. Account may be locked or disabled');
        console.error('  3. Server may require different authentication method');
        console.error('  4. IP address may not be whitelisted');
        console.error('Response:', error.response);
        // Don't retry on auth errors
        break;
      } else if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
        console.error('\n⏱️  SMTP CONNECTION TIMEOUT');
        console.error('Possible causes:');
        console.error('  1. Firewall blocking connection to', smtpHost, 'port', smtpPort);
        console.error('  2. SMTP server is down or unreachable');
        console.error('  3. Network connectivity issues');
        console.error('  4. Wrong port number (try 465 for SSL or 587 for TLS)');
        // Retry on timeout
        if (attempt < maxRetries - 1) {
          console.log('Will retry...');
          continue;
        }
      } else if (error.code === 'ECONNECTION' || error.code === 'ENOTFOUND') {
        console.error('\n🔌 SMTP CONNECTION FAILED');
        console.error('Possible causes:');
        console.error('  1. Hostname', smtpHost, 'cannot be resolved (DNS issue)');
        console.error('  2. Wrong SMTP host address');
        console.error('  3. Server is not accessible from this network');
        console.error('  4. Port', smtpPort, 'is blocked');
        // Retry on connection errors
        if (attempt < maxRetries - 1) {
          console.log('Will retry...');
          continue;
        }
      } else if (error.code === 'EENVELOPE') {
        console.error('\n✉️  SMTP ENVELOPE ERROR');
        console.error('Possible causes:');
        console.error('  1. Invalid email addresses');
        console.error('  2. Server rejected recipient address');
        console.error('Response:', error.response);
        // Don't retry on envelope errors
        break;
      } else {
        console.error('\n⚠️  UNKNOWN SMTP ERROR');
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        // For other errors, try once more
        if (attempt < maxRetries - 1) {
          console.log('Will retry...');
          continue;
        }
      }
    }
  }
  
  // All attempts failed
  console.error('\n❌ ALL EMAIL SEND ATTEMPTS FAILED');
  console.error('Final error summary:', {
    message: lastError?.message,
    code: lastError?.code,
    attempts: maxRetries,
    totalDuration: Date.now() - (Date.now() - (maxRetries * 30000))
  });
  console.error('\n=== Troubleshooting Steps ===');
  console.error('1. Verify SMTP credentials in .env file');
  console.error('2. Test SMTP connection manually:');
  console.error(`   telnet ${smtpHost} ${smtpPort}`);
  console.error('3. Check firewall rules');
  console.error('4. Verify SMTP server is running and accessible');
  console.error('5. Try different port (465 for SSL, 587 for TLS)');
  console.error('============================\n');
  
  return false;
}

export async function POST(request) {
  const startTime = Date.now();
  let clientIP = 'unknown';
  
  try {
    // Get client IP for rate limiting
    clientIP = getClientIP(request);
    
    // Rate limiting: 5 requests per 15 minutes per IP
    const rateLimitResult = rateLimit(clientIP, 5, 15 * 60 * 1000);
    
    if (!rateLimitResult.allowed) {
      const resetTime = rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toISOString() : new Date(Date.now() + 15 * 60 * 1000).toISOString();
      return NextResponse.json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      }, { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime
        }
      });
    }
    
    // Parse and validate request body
    let payload;
    try {
      payload = await request.json();
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request format.'
      }, { status: 400 });
    }
    
    const { name, email, message: userMessage } = payload || {};
    
    // Input validation
    if (!name || !email || !userMessage) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required.'
      }, { status: 400 });
    }
    
    // Validate and sanitize inputs
    if (!validateName(name)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid name format.'
      }, { status: 400 });
    }
    
    if (!validateEmail(email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format.'
      }, { status: 400 });
    }
    
    if (!validateMessage(userMessage)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid message format.'
      }, { status: 400 });
    }
    
    // Sanitize inputs
    const sanitizedName = sanitizeString(name, 100);
    const sanitizedEmail = sanitizeString(email, 254).toLowerCase();
    const sanitizedMessage = sanitizeString(userMessage, 2000);
    
    // Check for honeypot (if you add a hidden field in the form)
    if (payload.honeypot) {
      // Bot detected
      return NextResponse.json({
        success: false,
        message: 'Invalid request.'
      }, { status: 400 });
    }
    
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;
    
    // Create sanitized payload
    const sanitizedPayload = {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage
    };
    
    const message = `New message from ${sanitizedName}\n\nEmail: ${sanitizedEmail}\n\nMessage:\n\n${sanitizedMessage}\n\n`;

    // Send Telegram message (optional, non-blocking)
    let telegramSuccess = true;
    if (token && chat_id) {
      try {
        telegramSuccess = await Promise.race([
          sendTelegramMessage(token, chat_id, message),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
      } catch (telegramError) {
        // Don't fail the request if Telegram fails
        console.error('Telegram error (non-critical):', telegramError.message);
        telegramSuccess = false;
      }
    }

    // Send email (required)
    console.log('\n🚀 Starting email send process...');
    console.log('Request timestamp:', new Date().toISOString());
    console.log('Client IP:', clientIP);
    console.log('From:', sanitizedEmail);
    console.log('To:', process.env.RECEIVING_EMAIL || 'me@kakhki.ir');
    
    let emailSuccess = false;
    try {
      const emailStartTime = Date.now();
      emailSuccess = await Promise.race([
        sendEmail(sanitizedPayload, message),
        new Promise((_, reject) => {
          setTimeout(() => {
            console.error('⏱️  Overall email process timeout after 30 seconds');
            reject(new Error('Overall timeout'));
          }, 30000);
        })
      ]);
      const emailTotalTime = Date.now() - emailStartTime;
      console.log(`✅ Email process completed successfully in ${emailTotalTime}ms`);
    } catch (emailError) {
      console.error('\n❌ Email sending error caught in POST handler:');
      console.error('Error Type:', emailError.constructor.name);
      console.error('Error Message:', emailError.message);
      if (emailError.code) console.error('Error Code:', emailError.code);
      if (emailError.stack) {
        console.error('Stack Trace:');
        console.error(emailError.stack);
      }
      // Log error but don't expose details to client
    }

    if (emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!',
      }, { 
        status: 200,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toISOString() : new Date(Date.now() + 15 * 60 * 1000).toISOString()
        }
      });
    }

    // Generic error message (don't leak details)
    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Please try again later.',
    }, { status: 500 });
    
  } catch (error) {
    // Log error with context but don't expose to client
    console.error('API Error:', {
      message: error.message,
      ip: clientIP,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    });
    
    // Generic error response (security: don't leak error details)
    return NextResponse.json({
      success: false,
      message: 'An error occurred. Please try again later.',
    }, { status: 500 });
  }
};