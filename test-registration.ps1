# Test script to verify role-based registration

# Wait for backend to be ready
Write-Host "Waiting for backend server to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test Patient Registration
Write-Host "`n=== Testing Patient Registration ===" -ForegroundColor Cyan
$patientBody = @{
    name = "John Patient"
    email = "patient@example.com"
    password = "password123"
    role = "patient"
} | ConvertTo-Json

try {
    $patientResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post -ContentType "application/json" `
        -Body $patientBody -SkipCertificateCheck
    
    Write-Host "✅ Patient Registration Successful" -ForegroundColor Green
    Write-Host "Token: $($patientResult.token.Substring(0,20))..." 
    Write-Host "User: $($patientResult.user | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Patient Registration Failed: $_" -ForegroundColor Red
}

# Test Doctor Registration
Write-Host "`n=== Testing Doctor Registration ===" -ForegroundColor Cyan
$doctorBody = @{
    name = "Dr. Sarah Smith"
    email = "doctor@example.com"
    password = "password123"
    role = "doctor"
} | ConvertTo-Json

try {
    $doctorResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post -ContentType "application/json" `
        -Body $doctorBody -SkipCertificateCheck
    
    Write-Host "✅ Doctor Registration Successful" -ForegroundColor Green
    Write-Host "Token: $($doctorResult.token.Substring(0,20))..."
    Write-Host "User: $($doctorResult.user | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Doctor Registration Failed: $_" -ForegroundColor Red
}

# Test Support Registration
Write-Host "`n=== Testing Support Registration ===" -ForegroundColor Cyan
$supportBody = @{
    name = "Mike Support"
    email = "support@example.com"
    password = "password123"
    role = "support"
} | ConvertTo-Json

try {
    $supportResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method Post -ContentType "application/json" `
        -Body $supportBody -SkipCertificateCheck
    
    Write-Host "✅ Support Registration Successful" -ForegroundColor Green
    Write-Host "Token: $($supportResult.token.Substring(0,20))..."
    Write-Host "User: $($supportResult.user | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Support Registration Failed: $_" -ForegroundColor Red
}

Write-Host "`n✅ All registration tests completed!" -ForegroundColor Green
