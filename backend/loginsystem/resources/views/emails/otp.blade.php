<!DOCTYPE html>
<html>

<head>
    <style>
        .container {
            font-family: sans-serif;
            padding: 40px;
            background: #f8fafc;
            color: #1e293b;
            text-align: center;
        }

        .card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: inline-block;
        }

        .code {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 5px;
            color: #4f46e5;
            margin: 20px 0;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #64748b;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="card">
            <h2>EliteOJT Security Code</h2>
            <p>Use the code below to sign in to your account. This code expires in 10 minutes.</p>
            <div class="code">{{ $otp }}</div>
            <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Elite OJT Tracker Pro. Institutional Access System.
        </div>
    </div>
</body>

</html>
