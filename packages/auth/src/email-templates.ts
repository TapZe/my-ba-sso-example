interface VerificationEmailParams {
	userName?: string;
	verificationUrl: string;
	appName?: string;
}

export function getVerificationEmailTemplate({
	userName,
	verificationUrl,
	appName = "My SSO App",
}: VerificationEmailParams): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #666666;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .verify-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        .alternative-link {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .alternative-link p {
            font-size: 14px;
            color: #666666;
            margin-bottom: 10px;
        }
        .url-text {
            font-size: 12px;
            color: #667eea;
            word-break: break-all;
            font-family: monospace;
            background-color: #ffffff;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        .footer-text {
            font-size: 14px;
            color: #999999;
            margin-bottom: 10px;
        }
        .security-notice {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .security-notice p {
            font-size: 14px;
            color: #856404;
            margin: 0;
        }
        .icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin-bottom: 20px;
            line-height: 60px;
            font-size: 30px;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .verify-button {
                padding: 14px 30px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon">✉️</div>
            <h1>Verify Your Email Address</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ""},
            </div>
            
            <div class="message">
                <p>Thank you for signing up for <strong>${appName}</strong>!</p>
                <p>To complete your registration and start using your account, please verify your email address by clicking the button below.</p>
            </div>
            
            <div class="button-container">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
            </div>
            
            <div class="security-notice">
                <p>⏱️ <strong>This link will expire in 1 hour</strong> for security reasons.</p>
            </div>
            
            <div class="alternative-link">
                <p><strong>Button not working?</strong></p>
                <p>Copy and paste this link into your browser:</p>
                <div class="url-text">${verificationUrl}</div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                If you didn't create an account with ${appName}, you can safely ignore this email.
            </p>
            <p class="footer-text">
                This is an automated message, please do not reply to this email.
            </p>
            <p class="footer-text" style="margin-top: 20px; color: #cccccc;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

interface PasswordResetEmailParams {
	userName?: string;
	resetUrl: string;
	appName?: string;
}

export function getPasswordResetEmailTemplate({
	userName,
	resetUrl,
	appName = "My SSO App",
}: PasswordResetEmailParams): string {
	return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 600;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #666666;
            line-height: 1.8;
            margin-bottom: 30px;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .reset-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
        }
        .alternative-link {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #f5576c;
        }
        .alternative-link p {
            font-size: 14px;
            color: #666666;
            margin-bottom: 10px;
        }
        .url-text {
            font-size: 12px;
            color: #f5576c;
            word-break: break-all;
            font-family: monospace;
            background-color: #ffffff;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        .footer-text {
            font-size: 14px;
            color: #999999;
            margin-bottom: 10px;
        }
        .security-notice {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .security-notice p {
            font-size: 14px;
            color: #721c24;
            margin: 0;
        }
        .icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin-bottom: 20px;
            line-height: 60px;
            font-size: 30px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="icon">🔐</div>
            <h1>Reset Your Password</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello${userName ? ` ${userName}` : ""},
            </div>
            
            <div class="message">
                <p>We received a request to reset your password for your <strong>${appName}</strong> account.</p>
                <p>Click the button below to create a new password:</p>
            </div>
            
            <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
            </div>
            
            <div class="security-notice">
                <p>⚠️ <strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
            </div>
            
            <div class="alternative-link">
                <p><strong>Button not working?</strong></p>
                <p>Copy and paste this link into your browser:</p>
                <div class="url-text">${resetUrl}</div>
            </div>
            
            <div class="security-notice" style="background-color: #fff3cd; border-left-color: #ffc107;">
                <p style="color: #856404;">🛡️ If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                This is an automated message, please do not reply to this email.
            </p>
            <p class="footer-text" style="margin-top: 20px; color: #cccccc;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}
